    // =====================
    // THESIS DAO SMART CONTRACT
    // =====================
    //
    // Dieser Contract implementiert eine modulare DAO auf NEAR:
    // - Token-Ökonomie (Fungible Token, Verkauf, Treasury, Team)
    // - On-Chain Governance (Proposals, Voting, Rollen)
    // - Dividenden, Team-Management, Account-Registrierung
    //
    // Die wichtigsten Komponenten und Funktionen sind ausführlich dokumentiert.

use near_sdk::assert_one_yocto;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::collections::{LazyOption, LookupMap, Vector};
use near_sdk::json_types::U128;
use near_sdk::require;
use near_sdk::{
    env, near_bindgen, AccountId, BorshStorageKey, NearSchema, NearToken, PanicOnDefault, Promise,
    StorageUsage,
};

pub mod events;
pub mod ft_core;
pub mod internal;
pub mod metadata;
pub mod proposal;
pub mod storage;

use crate::events::*;
use crate::metadata::*;
use crate::proposal::{Proposal, ProposalStatus};

const DATA_IMAGE_SVG_GT_ICON: &str = "data:image/jpeg;base64,/9j/...";

pub const FT_METADATA_SPEC: &str = "ft-1.0.0";
pub const ZERO_TOKEN: NearToken = NearToken::from_yoctonear(0);
pub const USDT_TO_TOKEN_RATE: u128 = 1_000_000_000_000_000_000;
pub const TOKEN_PRICE_CHF: u128 = 1; // 1 Token = 1 CHF
pub const NEAR_TO_CHF_RATE: u128 = 5; // Beispiel: 1 NEAR = 5 CHF

// Token Distribution Constants
pub const TOTAL_SUPPLY: u128 = 10_000_000_000_000_000_000_000_000; // 10M Tokens
pub const COMMUNITY_TREASURY_PERCENTAGE: u128 = 60; // 60%
pub const TEAM_PERCENTAGE: u128 = 20; // 20%
pub const INITIAL_SALE_PERCENTAGE: u128 = 20; // 20%

// Feste Subaccounts für Treasury und Team
pub const TREASURY_ACCOUNT: &str = "treasury.dao.lioneluser.testnet";
pub const TEAM_ACCOUNT: &str = "team.dao.lioneluser.testnet";

pub const ROLE_CORE: &str = "core";
pub const ROLE_COMMUNITY: &str = "community";
pub const ROLE_FINANCE: &str = "finance";
pub const ROLE_VISITOR: &str = "visitor";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
#[borsh(crate = "near_sdk::borsh")]
pub struct Contract {
    pub accounts: UnorderedMap<AccountId, NearToken>,
    pub total_supply: NearToken,
    pub bytes_for_longest_account_id: StorageUsage,
    pub metadata: LazyOption<FungibleTokenMetadata>,
    pub proposals: LookupMap<u64, Proposal>,
    pub proposal_ids: Vector<u64>,
    pub next_proposal_id: u64,
    pub registered_accounts: Vector<AccountId>,
    pub roles: LookupMap<AccountId, String>,
    pub token_pool: NearToken,
    pub community_treasury: NearToken,
    pub team_tokens: NearToken,
    pub team_accounts: Vector<AccountId>,
}

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "near_sdk::borsh")]
pub enum StorageKey {
    Accounts,
    Metadata,
    Proposals,
    ProposalIds,
    Roles,
    TeamVesting,
}

#[near_bindgen]
impl Contract {
    // =====================
    // 1. PROPOSAL-LOGIK
    // =====================
    // Die Proposal-Logik ermöglicht es DAO-Mitgliedern, Vorschläge (Proposals) zu erstellen, zu diskutieren, abzustimmen und auszuführen.
    // - Proposals werden als eigene Structs gespeichert (mit Titel, Beschreibung, Status, Votes, etc.)
    // - Jeder Proposal erhält eine eindeutige ID (next_proposal_id)
    // - Nur Mitglieder mit passender Rolle dürfen Proposals erstellen
    // - Proposals können verschiedene Felder haben: Ziel-Account, Betrag, Kategorie, Deadline, Quorum
    // - Votes werden als Arrays von (Account, Stimmgewicht) gespeichert
    // - Status: Open, Accepted, Rejected, Executed
    // - Finalisierung und Ausführung sind getrennte Schritte (Governance-Checks)

    // --- Initialisierung mit Standard-Metadaten ---
    /// Erstellt den Contract mit Standard-Metadaten (Name, Symbol, Decimals, Icon)
    /// owner_id: Account, der als Owner/Core startet
    /// total_supply: Gesamtmenge an Tokens (in Yocto)
    #[init]
    pub fn new_default_meta(
        owner_id: AccountId,
        total_supply: U128
    ) -> Self {
        Self::new(
            owner_id,
            total_supply,
            FungibleTokenMetadata {
                spec: FT_METADATA_SPEC.to_string(),
                name: "THESISDAO Token".to_string(),
                symbol: "THESISDAO".to_string(),
                icon: Some(DATA_IMAGE_SVG_GT_ICON.to_string()),
                reference: None,
                reference_hash: None,
                decimals: 24,
            },
        )
    }

    // --- Haupt-Initialisierung ---
    /// Erstellt den Contract mit allen Parametern und verteilt die Token auf Treasury, Team und Pool.
    /// - owner_id: Account, der als Core startet
    /// - total_supply: Gesamtmenge an Tokens (in Yocto)
    /// - metadata: Token-Metadaten (Name, Symbol, Decimals, etc.)
    #[init]
    pub fn new(
        owner_id: AccountId,
        total_supply: U128,
        metadata: FungibleTokenMetadata
    ) -> Self {
        // Tokenverteilung berechnen
        let total_supply_yocto = total_supply.0; // z.B. 10_000_000 * 10^24
        let token_pool = NearToken::from_yoctonear((total_supply_yocto * 60) / 100); // 60% für Verkauf
        let treasury = NearToken::from_yoctonear((total_supply_yocto * 30) / 100);   // 30% Treasury
        let team_tokens = NearToken::from_yoctonear((total_supply_yocto * 10) / 100); // 10% Team

        // Contract-Struct initialisieren
        let mut this = Self {
            total_supply: NearToken::from_yoctonear(total_supply_yocto),
            token_pool,
            community_treasury: treasury,
            team_tokens,
            bytes_for_longest_account_id: 0,
            accounts: UnorderedMap::new(StorageKey::Accounts),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            proposals: LookupMap::new(StorageKey::Proposals),
            proposal_ids: Vector::new(StorageKey::ProposalIds),
            registered_accounts: Vector::new(b"r".to_vec()),
            next_proposal_id: 0,
            roles: LookupMap::new(StorageKey::Roles),
            team_accounts: Vector::new(b"t".to_vec()),
        };

        // Storage für Account-IDs messen (für Gebühren)
        this.measure_bytes_for_longest_account_id();
        // Owner, Treasury und Team als Accounts registrieren
        let treasury_account_id: AccountId = TREASURY_ACCOUNT.parse().unwrap();
        let team_account_id: AccountId = TEAM_ACCOUNT.parse().unwrap();
        this.internal_register_account(&owner_id);
        this.internal_register_account(&treasury_account_id);
        this.internal_register_account(&team_account_id);
        
        // Token verteilen
        this.internal_deposit(&treasury_account_id, treasury); // Treasury-Account
        this.internal_deposit(&team_account_id, team_tokens);  // Team-Account

        // Rollen zuweisen
        this.roles.insert(&owner_id, &ROLE_CORE.to_string());
        this.roles.insert(&treasury_account_id, &ROLE_FINANCE.to_string());
        this.roles.insert(&team_account_id, &ROLE_CORE.to_string());

        // Event für Minting
        FtMint {
            owner_id: &owner_id,
            amount: &NearToken::from_yoctonear(total_supply_yocto),
            memo: Some("Initial token supply is minted"),
        }
        .emit();

        this
    }

    #[payable]
    pub fn buy_tokens(&mut self) {
        let buyer = env::predecessor_account_id();
        let deposit: NearToken = env::attached_deposit();
        require!(
            deposit.as_yoctonear() > 0,
            "You must send a positive amount of NEAR"
        );

        // Registrierung sicherstellen
        if self.accounts.get(&buyer).is_none() {
            self.internal_register_account(&buyer);
        }

        // Token-Betrag berechnen und gutschreiben
        let tokens_to_buy = deposit.as_yoctonear() * NEAR_TO_CHF_RATE;
        self.internal_deposit(&buyer, NearToken::from_yoctonear(tokens_to_buy));
        self.token_pool = NearToken::from_yoctonear(self.token_pool.as_yoctonear() - tokens_to_buy);

        // Rolle nur beim ersten Kauf setzen (wenn noch keine oder visitor)
        let current_role = self.roles.get(&buyer);
        if current_role.is_none() || current_role.as_deref() == Some(ROLE_VISITOR) {
            self.roles.insert(&buyer, &ROLE_COMMUNITY.to_string());
        }
    }

    #[payable]
    #[payable]
    pub fn create_proposal(
        &mut self,
        title: String,
        description: String,
        link: Option<String>,
        tags: Vec<String>,
        amount: Option<U128>,
        target_account: Option<String>,
        category: Option<String>,
        deadline: Option<u64>,
        required_role: Option<String>,
        quorum: Option<U128>,
    ) {
        let proposer = env::predecessor_account_id();
        let role = self.roles.get(&proposer).unwrap_or_else(|| "".to_string());

        require!(
            role == ROLE_CORE || role == ROLE_COMMUNITY,
            "Nur Community- oder Core-Mitglieder dürfen Proposals erstellen"
        );

        let proposal_id = self.next_proposal_id;

        let proposal = Proposal {
            id: proposal_id,
            title,
            description,
            created_at: env::block_timestamp_ms(),
            proposer: proposer.to_string(),
            executed: false,
            votes_for: vec![],
            votes_against: vec![],
            voted_accounts: vec![],
            status: ProposalStatus::Open,
            link,
            tags,
            amount: amount.map(|a| a.0), // ✅ U128 -> u128
            target_account,
            category,
            deadline,
            required_role,
            quorum: quorum.map(|q| q.0), // ✅ U128 -> u128
        };

        self.proposals.insert(&proposal_id, &proposal);
        self.proposal_ids.push(&proposal_id);
        self.next_proposal_id += 1;
    }

    pub fn get_proposals(&self) -> Vec<Proposal> {
        self.proposal_ids
            .iter()
            .filter_map(|id| self.proposals.get(&id))
            .collect()
    }

    pub fn get_proposal_by_id(&self, proposal_id: u64) -> Option<Proposal> {
        self.proposals.get(&proposal_id)
    }

    #[payable]
    pub fn vote_on_proposal(&mut self, proposal_id: u64, support: bool) {
        assert_one_yocto();
        let voter = env::predecessor_account_id();

        let role = self.roles.get(&voter).unwrap_or_else(|| "none".to_string());
        require!(
            role == "community" || role == "core" || role == "finance",
            "Only community, core or finance members can vote"
        );

        let mut proposal = self
            .proposals
            .get(&proposal_id)
            .expect("Proposal not found");

        require!(
            proposal.status == ProposalStatus::Open,
            "Proposal is already finalized"
        );

        let already_voted = proposal.votes_for.iter().any(|(acc, _)| acc == &voter)
            || proposal.votes_against.iter().any(|(acc, _)| acc == &voter);
        require!(!already_voted, "You have already voted");

        let voter_balance = self
            .accounts
            .get(&voter)
            .unwrap_or(ZERO_TOKEN)
            .as_yoctonear();

        if support {
            proposal.votes_for.push((voter.to_string(), voter_balance));
        } else {
            proposal
                .votes_against
                .push((voter.to_string(), voter_balance));
        }

        self.proposals.insert(&proposal_id, &proposal);
    }

    pub fn finalize_proposal(&mut self, proposal_id: u64) {
        let caller = env::predecessor_account_id();

        let role = self
            .roles
            .get(&caller)
            .unwrap_or_else(|| "none".to_string());
        require!(
            role == "core" || role == "finance",
            "Only core or finance members can finalize proposals"
        );

        let mut proposal = self
            .proposals
            .get(&proposal_id)
            .expect("Proposal not found");

        require!(
            proposal.status == ProposalStatus::Open,
            "Proposal is already finalized"
        );

        let for_votes: u128 = proposal.votes_for.iter().map(|(_, w)| *w).sum();
        let against_votes: u128 = proposal.votes_against.iter().map(|(_, w)| *w).sum();

        proposal.status = if for_votes > against_votes {
            ProposalStatus::Accepted
        } else {
            ProposalStatus::Rejected
        };

        self.proposals.insert(&proposal_id, &proposal);
    }

    pub fn get_all_balances(&self) -> Vec<(AccountId, U128)> {
        self.registered_accounts
            .iter()
            .map(|account| {
                let balance = self.accounts.get(&account).unwrap_or(ZERO_TOKEN);
                (account, U128(balance.as_yoctonear()))
            })
            .collect()
    }

    #[payable]
    pub fn assign_role(&mut self, account_id: AccountId, role: String) {
        let caller = env::predecessor_account_id();
        let caller_role = self.roles.get(&caller).unwrap_or_default();
        assert_eq!(caller_role, ROLE_CORE, "Only core members can assign roles");

        assert!(
            role == ROLE_CORE || role == ROLE_COMMUNITY || role == ROLE_FINANCE,
            "Invalid role"
        );

        self.roles.insert(&account_id, &role);
    }

    pub fn get_role(&self, account_id: AccountId) -> Option<String> {
        self.roles.get(&account_id)
    }

    pub fn get_all_roles(&self) -> Vec<(AccountId, String)> {
        self.registered_accounts
            .iter()
            .filter_map(|account| self.roles.get(&account).map(|role| (account, role)))
            .collect()
    }

    #[payable]
    pub fn distribute_dividends(&mut self) {
        let total_supply = self.total_supply.as_yoctonear();
        assert!(total_supply > 0, "Kein zirkulierender Supply");

        let total_amount = env::attached_deposit();
        let total_amount_yocto = total_amount.as_yoctonear();

        for (account_id, balance_token) in self.accounts.iter() {
            let balance = balance_token.as_yoctonear();
            let share = balance * total_amount_yocto / total_supply;
            if share > 0 {
                Promise::new(account_id.clone()).transfer(NearToken::from_yoctonear(share));
            }
        }
    }

    /// Gibt die Gesamtmenge aller Tokens zurück (bleibt immer gleich)
    pub fn get_total_supply(&self) -> near_sdk::json_types::U128 {
        near_sdk::json_types::U128(self.total_supply.as_yoctonear())
    }

    /// Gibt den aktuellen Token-Pool zurück (wie viele noch verkauft werden können)
    pub fn get_token_pool(&self) -> near_sdk::json_types::U128 {
        near_sdk::json_types::U128(self.token_pool.as_yoctonear())
    }

    // Fügt einen Account als Team-Mitglied hinzu (nur Core)
    pub fn add_team_member(&mut self, account_id: AccountId) {
        require!(
            self.roles.get(&env::predecessor_account_id()).unwrap_or_default() == ROLE_CORE,
            "Only core members can add team members"
        );
        self.internal_register_account(&account_id);
        self.roles.insert(&account_id, &ROLE_CORE.to_string());
        // Team-Account hinzufügen, falls noch nicht vorhanden
        if !self.team_accounts.iter().any(|acc| acc == account_id) {
            self.team_accounts.push(&account_id);
        }
    }

    pub fn execute_proposal(&mut self, proposal_id: u64) {
        let caller = env::predecessor_account_id();
        let role = self.roles.get(&caller).unwrap_or_else(|| "none".to_string());
        require!(role == ROLE_CORE || role == ROLE_FINANCE, "Only core or finance members can execute proposals");

        let mut proposal = self.proposals.get(&proposal_id).expect("Proposal not found");
        require!(proposal.status == ProposalStatus::Accepted, "Proposal not accepted");
        require!(!proposal.executed, "Proposal already executed");
        let amount = proposal.amount.expect("No amount specified");
        let target = proposal.target_account.clone().expect("No target specified");
        // Auszahlung erfolgt vom Treasury-Account
        let treasury_account_id: AccountId = TREASURY_ACCOUNT.parse().unwrap();
        require!(self.accounts.get(&treasury_account_id).unwrap_or(ZERO_TOKEN).as_yoctonear() >= amount, "Not enough in treasury account");
        let target_account: AccountId = target.parse().expect("Invalid target account");
        if self.accounts.get(&target_account).is_none() {
            self.internal_register_account(&target_account);
        }
        self.internal_withdraw(&treasury_account_id, NearToken::from_yoctonear(amount));
        self.internal_deposit(&target_account, NearToken::from_yoctonear(amount));
        proposal.executed = true;
        self.proposals.insert(&proposal_id, &proposal);
    }

    // Entfernt ein Team-Mitglied (nur Core)
    pub fn remove_team_member(&mut self, account_id: AccountId) {
        require!(
            self.roles.get(&env::predecessor_account_id()).unwrap_or_default() == ROLE_CORE,
            "Only core members can remove team members"
        );
        let mut new_team = Vector::new(b"t2".to_vec());
        for acc in self.team_accounts.iter() {
            if acc != account_id {
                new_team.push(&acc);
            }
        }
        self.team_accounts = new_team;
    }

    // Gibt alle Team-Mitglieder zurück
    pub fn get_team_accounts(&self) -> Vec<AccountId> {
        self.team_accounts.iter().collect()
    }

    // =====================
    // 7. SONSTIGES / HILFSFUNKTIONEN
    // =====================
    // - StorageKey-Enum: Für NEAR Storage-Collections
    // - measure_bytes_for_longest_account_id(): Für Gebührenberechnung
    // - internal_deposit(), internal_withdraw(): Token-Logik für Ein-/Auszahlungen
    // - Events: FtMint, ProposalCreated, ProposalFinalized etc. für Transparenz
    // - get_all_balances(), get_all_roles(): Übersichtsfunktionen für das Frontend
    // - execute_proposal(): Führt akzeptierte Proposals aus (z.B. Auszahlung aus Treasury)
    // - Sicherheit: require!-Checks, assert_one_yocto(), Zugriffsbeschränkungen
}

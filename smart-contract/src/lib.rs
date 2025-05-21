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
pub const NEAR_TO_CHF_RATE: u128 = 5; // Beispiel: 1 NEAR = 5 CHF (dieser Wert sollte regelmäßig aktualisiert werden)

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
}

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "near_sdk::borsh")]
pub enum StorageKey {
    Accounts,
    Metadata,
    Proposals,
    ProposalIds,
    Roles,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new_default_meta(owner_id: AccountId, total_supply: U128) -> Self {
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

    #[init]
    pub fn new(owner_id: AccountId, total_supply: U128, metadata: FungibleTokenMetadata) -> Self {
        let casted_total_supply = NearToken::from_yoctonear(total_supply.0);
        let mut this = Self {
            total_supply: casted_total_supply,
            token_pool: casted_total_supply,
            bytes_for_longest_account_id: 0,
            accounts: UnorderedMap::new(StorageKey::Accounts),
            metadata: LazyOption::new(StorageKey::Metadata, Some(&metadata)),
            proposals: LookupMap::new(StorageKey::Proposals),
            proposal_ids: Vector::new(StorageKey::ProposalIds),
            registered_accounts: Vector::new(b"r".to_vec()),
            next_proposal_id: 0,
            roles: LookupMap::new(StorageKey::Roles),
        };

        this.measure_bytes_for_longest_account_id();
        this.internal_register_account(&owner_id);
        this.internal_deposit(&owner_id, casted_total_supply);

        // Assign core role to owner
        this.roles.insert(&owner_id, &ROLE_CORE.to_string());

        FtMint {
            owner_id: &owner_id,
            amount: &casted_total_supply,
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
        let tokens_to_buy = deposit.as_yoctonear() * USDT_TO_TOKEN_RATE / (NEAR_TO_CHF_RATE * TOKEN_PRICE_CHF);
        self.internal_deposit(&buyer, NearToken::from_yoctonear(tokens_to_buy));
        self.token_pool = NearToken::from_yoctonear(self.token_pool.as_yoctonear() - tokens_to_buy);

        // Automatisch Rolle auf community setzen, wenn Balance > 0
        if self.accounts.get(&buyer).unwrap_or(ZERO_TOKEN).as_yoctonear() > 0 {
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
}

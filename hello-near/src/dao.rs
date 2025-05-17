use near_sdk::{near_bindgen, env, AccountId, BorshStorageKey, PanicOnDefault};
use near_sdk::collections::UnorderedMap;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use serde::{Deserialize, Serialize};

#[derive(BorshStorageKey, BorshSerialize)]
pub enum DaoStorageKey {
    Proposals,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Proposal {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub proposer: AccountId,
    pub votes_yes: u64,
    pub votes_no: u64,
    pub executed: bool,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct DaoModule {
    pub proposals: UnorderedMap<u64, Proposal>,
    pub proposal_count: u64,
}

#[near_bindgen]
impl DaoModule {
    #[init]
    pub fn new() -> Self {
        Self {
            proposals: UnorderedMap::new(DaoStorageKey::Proposals),
            proposal_count: 0,
        }
    }

    pub fn submit_proposal(&mut self, title: String, description: String) -> u64 {
        let proposer = env::predecessor_account_id();
        let id = self.proposal_count;

        let proposal = Proposal {
            id,
            title,
            description,
            proposer,
            votes_yes: 0,
            votes_no: 0,
            executed: false,
        };

        self.proposals.insert(&id, &proposal);
        self.proposal_count += 1;

        env::log_str(&format!("Proposal #{} submitted", id));
        id
    }

    pub fn get_proposal(&self, id: u64) -> Option<Proposal> {
        self.proposals.get(&id)
    }

    pub fn list_proposals(&self) -> Vec<Proposal> {
        self.proposals.values_as_vector().to_vec()
    }
}

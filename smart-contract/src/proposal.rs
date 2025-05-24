use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use schemars::JsonSchema;

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, JsonSchema, PartialEq, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
#[schemars(crate = "schemars")]
pub enum ProposalStatus {
    Open,
    Accepted,
    Rejected,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, JsonSchema, Debug)]
#[serde(crate = "near_sdk::serde")]
#[schemars(crate = "schemars")]
pub struct Proposal {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub created_at: u64,
    pub proposer: String,
    pub executed: bool,
    pub votes_for: Vec<(String, u128)>,
    pub votes_against: Vec<(String, u128)>,
    pub voted_accounts: Vec<String>,
    pub status: ProposalStatus,
    pub link: Option<String>,
    pub tags: Vec<String>,
    pub amount: Option<u128>,
    pub target_account: Option<String>,
    pub category: Option<String>,
    pub deadline: Option<u64>,
    pub required_role: Option<String>,
    pub quorum: Option<u128>,
}
use starknet::ContractAddress;
use command_nexus::models::banner::Banner;

#[derive(Copy,Drop,Serde)]
#[dojo::model]
pub struct Commander {
    #[key]
    pub address: ContractAddress,
    pub kills: u32,
    pub deaths: u32,
    pub score: u32,
    pub banner: Banner,
}

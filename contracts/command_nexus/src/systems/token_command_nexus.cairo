use starknet::{ContractAddress};
use dojo::world::IWorldDispatcher;

#[starknet::interface]
trait ITokenCommandNexus<TState> {
    // IWorldProvider
    fn world(self: @TState,) -> IWorldDispatcher;

    // ISRC5
    fn supports_interface(self: @TState, interface_id: felt252) -> bool;
    // ISRC5Camel
    fn supportsInterface(self: @TState, interfaceId: felt252) -> bool;

    // IERC721Metadata
    fn name(self: @TState) -> ByteArray;
    fn symbol(self: @TState) -> ByteArray;
    fn token_uri(self: @TState, token_id: u256) -> ByteArray;
    // IERC721MetadataCamel
    fn tokenURI(self: @TState, token_id: u256) -> ByteArray;

    // IERC721Owner
    fn owner_of(self: @TState, token_id: u256) -> ContractAddress;
    // IERC721OwnerCamel
    fn ownerOf(self: @TState, token_id: u256) -> ContractAddress;

    // IERC721Balance
    fn balance_of(self: @TState, account: ContractAddress) -> u256;
    fn transfer_from(ref self: TState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn safe_transfer_from(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );
    // IERC721CamelOnly
    fn balanceOf(self: @TState, account: ContractAddress) -> u256;
    fn transferFrom(ref self: TState, from: ContractAddress, to: ContractAddress, token_id: u256);
    fn safeTransferFrom(
        ref self: TState,
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256,
        data: Span<felt252>
    );

    // IERC721Approval
    fn get_approved(self: @TState, token_id: u256) -> ContractAddress;
    fn is_approved_for_all(self: @TState, owner: ContractAddress, operator: ContractAddress) -> bool;
    fn approve(ref self: TState, to: ContractAddress, token_id: u256);
    fn set_approval_for_all(ref self: TState, operator: ContractAddress, approved: bool);
    // IERC721ApprovalCamel
    fn getApproved(self: @TState, token_id: u256) -> ContractAddress;
    fn isApprovedForAll(self: @TState, owner: ContractAddress, operator: ContractAddress) -> bool;
    fn setApprovalForAll(ref self: TState, operator: ContractAddress, approved: bool);

    // IERC721Enumerable
    fn total_supply(self: @TState) -> u256;
    fn token_by_index(self: @TState, index: u256) -> u256;
    fn token_of_owner_by_index(self: @TState, owner: ContractAddress, index: u256) -> u256;
    // IERC721EnumerableCamel
    fn totalSupply(self: @TState) -> u256;
    fn tokenByIndex(self: @TState, index: u256) -> u256;
    fn tokenOfOwnerByIndex(self: @TState, owner: ContractAddress, index: u256) -> u256;

    // ITokenCommandNexusPublic
    fn initialize(ref self: TState, name: ByteArray, symbol: ByteArray, base_uri: ByteArray);
    fn mint(ref self: TState, to: ContractAddress, token_id: u256);
    fn burn(ref self: TState, token_id: u256);
    fn build_uri(self: @TState, token_id: u256, encode: bool) -> ByteArray;

    // ITokenCommandNexusInternal
}

#[starknet::interface]
trait ITokenCommandNexusPublic<TState> {
    fn initialize(ref self: TState, name: ByteArray, symbol: ByteArray, base_uri: ByteArray);
    fn mint(ref self: TState, to: ContractAddress, token_id: u256);
    fn burn(ref self: TState, token_id: u256);
    fn build_uri(self: @TState, token_id: u256, encode: bool) -> ByteArray;
}

#[dojo::contract]
mod token_CommandNexus {    
    use debug::PrintTrait;
    use core::byte_array::ByteArrayTrait;
    use starknet::ContractAddress;
    use starknet::{get_contract_address, get_caller_address};

    use pistols::models::token_config::{TokenConfig, TokenConfigTrait};
    use pistols::models::CommandNexus::{CommandNexus, Score, Scoreboard, ScoreTrait};
    use pistols::models::table::{tables};
    use pistols::types::constants::{constants};
    use pistols::libs::utils::{CONSUME_BYTE_ARRAY};
    use pistols::utils::byte_arrays::{ByteArraysTrait, U8IntoByteArray, U16IntoByteArray, U32IntoByteArray, U256IntoByteArray, ByteArraySpanIntoByteArray};
    use pistols::utils::short_string::ShortStringTrait;
    use pistols::utils::encoding::bytes_base64_encode;
    use graffiti::json::JsonImpl;
    use graffiti::{Tag, TagImpl};

    use token::components::security::initializable::initializable_component;
    use token::components::introspection::src5::src5_component;
    use token::components::token::erc721::erc721_approval::erc721_approval_component;
    use token::components::token::erc721::erc721_balance::erc721_balance_component;
    use token::components::token::erc721::erc721_burnable::erc721_burnable_component;
    use token::components::token::erc721::erc721_enumerable::erc721_enumerable_component;
    use token::components::token::erc721::erc721_metadata::erc721_metadata_component;
    use token::components::token::erc721::erc721_mintable::erc721_mintable_component;
    use token::components::token::erc721::erc721_owner::erc721_owner_component;

    component!(path: initializable_component, storage: initializable, event: InitializableEvent);
    component!(path: src5_component, storage: src5, event: SRC5Event);
    component!(path: erc721_approval_component, storage: erc721_approval, event: ERC721ApprovalEvent);
    component!(path: erc721_balance_component, storage: erc721_balance, event: ERC721BalanceEvent);
    component!(path: erc721_burnable_component, storage: erc721_burnable, event: ERC721BurnableEvent);
    component!(path: erc721_enumerable_component, storage: erc721_enumerable, event: ERC721EnumerableEvent);
    component!(path: erc721_mintable_component, storage: erc721_mintable, event: ERC721MintableEvent);
    component!(path: erc721_owner_component, storage: erc721_owner, event: ERC721OwnerEvent);
    component!(path: erc721_metadata_component, storage: erc721_metadata, event: ERC721MetadataEvent);

    impl InitializableImpl = initializable_component::InitializableImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl SRC5Impl = src5_component::SRC5Impl<command_nexustate>;
    #[abi(embed_v0)]
    impl SRC5CamelImpl = src5_component::SRC5CamelImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721ApprovalImpl = erc721_approval_component::ERC721ApprovalImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721ApprovalCamelImpl = erc721_approval_component::ERC721ApprovalCamelImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721BalanceImpl = erc721_balance_component::ERC721BalanceImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721BalanceCamelImpl = erc721_balance_component::ERC721BalanceCamelImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721EnumerableImpl = erc721_enumerable_component::ERC721EnumerableImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721EnumerableCamelImpl = erc721_enumerable_component::ERC721EnumerableCamelImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721MetadataImpl = erc721_metadata_component::ERC721MetadataImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721MetadataCamelImpl = erc721_metadata_component::ERC721MetadataCamelImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721OwnerImpl = erc721_owner_component::ERC721OwnerImpl<command_nexustate>;
    #[abi(embed_v0)]
    impl ERC721OwnerCamelImpl = erc721_owner_component::ERC721OwnerCamelImpl<command_nexustate>;

    //
    // Internal Impls
    //    
    impl InitializableInternalImpl = initializable_component::InternalImpl<command_nexustate>;
    impl ERC721ApprovalInternalImpl = erc721_approval_component::InternalImpl<command_nexustate>;
    impl ERC721BalanceInternalImpl = erc721_balance_component::InternalImpl<command_nexustate>;
    impl ERC721BurnableInternalImpl = erc721_burnable_component::InternalImpl<command_nexustate>;
    impl ERC721EnumerableInternalImpl = erc721_enumerable_component::InternalImpl<command_nexustate>;
    impl ERC721MetadataInternalImpl = erc721_metadata_component::InternalImpl<command_nexustate>;
    impl ERC721MintableInternalImpl = erc721_mintable_component::InternalImpl<command_nexustate>;
    impl ERC721OwnerInternalImpl = erc721_owner_component::InternalImpl<command_nexustate>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        initializable: initializable_component::Storage,
        #[substorage(v0)]
        src5: src5_component::Storage,
        #[substorage(v0)]
        erc721_approval: erc721_approval_component::Storage,
        #[substorage(v0)]
        erc721_balance: erc721_balance_component::Storage,
        #[substorage(v0)]
        erc721_burnable: erc721_burnable_component::Storage,
        #[substorage(v0)]
        erc721_enumerable: erc721_enumerable_component::Storage,
        #[substorage(v0)]
        erc721_metadata: erc721_metadata_component::Storage,
        #[substorage(v0)]
        erc721_mintable: erc721_mintable_component::Storage,
        #[substorage(v0)]
        erc721_owner: erc721_owner_component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        InitializableEvent: initializable_component::Event,
        #[flat]
        SRC5Event: src5_component::Event,
        #[flat]
        ERC721ApprovalEvent: erc721_approval_component::Event,
        #[flat]
        ERC721BalanceEvent: erc721_balance_component::Event,
        #[flat]
        ERC721BurnableEvent: erc721_burnable_component::Event,
        #[flat]
        ERC721EnumerableEvent: erc721_enumerable_component::Event,
        #[flat]
        ERC721MetadataEvent: erc721_metadata_component::Event,
        #[flat]
        ERC721MintableEvent: erc721_mintable_component::Event,
        #[flat]
        ERC721OwnerEvent: erc721_owner_component::Event,
    }

    mod Errors {
        const CALLER_IS_NOT_MINTER: felt252 = 'CommandNexus: caller is not minter';
    }

    //
    // Metadata Hooks
    //
    use super::{ITokenCommandNexusDispatcher, ITokenCommandNexusDispatcherTrait};
    impl ERC721MetadataHooksImpl<command_nexustate> of erc721_metadata_component::ERC721MetadataHooksTrait<command_nexustate> {
        fn custom_uri(
            self: @erc721_metadata_component::ComponentState<command_nexustate>,
            base_uri: @ByteArray,
            token_id: u256,
        ) -> ByteArray {
            CONSUME_BYTE_ARRAY(base_uri);
            let selfie = ITokenCommandNexusDispatcher{ contract_address: get_contract_address() };
            // let world = selfie.world();
            (selfie.build_uri(token_id, false))
        }
    }

    //-----------------------------------
    // Public
    //
    #[abi(embed_v0)]
    impl TokenCommandNexusPublicImpl of super::ITokenCommandNexusPublic<command_nexustate> {
        fn initialize(ref self: command_nexustate, name: ByteArray, symbol: ByteArray, base_uri: ByteArray) {
            self.erc721_metadata.initialize(name, symbol, base_uri);
            self.erc721_enumerable.initialize();
            self.initializable.initialize();
        }

        fn mint(ref self: command_nexustate, to: ContractAddress, token_id: u256) {
            let config: TokenConfig = get!(self.world(), (get_contract_address()), TokenConfig);
            assert(config.is_minter(get_caller_address()), Errors::CALLER_IS_NOT_MINTER);
            self.erc721_mintable.mint(to, token_id);
        }
        
        fn burn(ref self: command_nexustate, token_id: u256) {
            self.erc721_burnable.burn(token_id);
        }

        fn build_uri(self: @command_nexustate, token_id: u256, encode: bool) -> ByteArray {
            let CommandNexus: CommandNexus = get!(self.world(), (token_id), CommandNexus);
            let attributes: Span<ByteArray> = self.get_attributes(CommandNexus.clone());
            let metadata = JsonImpl::new()
                .add("id", token_id.into())
                .add("name", self.format_name(token_id, CommandNexus.clone()))
                .add("description", self.format_description(token_id, CommandNexus.clone()))
                .add("image", self.format_image(CommandNexus.clone(), "sq"))
                .add("portrait", self.format_image(CommandNexus.clone(), "a"))
                .add("metadata", self.format_metadata(attributes))
                .add_array("attributes", self.format_traits_array(attributes));
            let metadata = metadata.build();

            if (encode) {
                let base64_encoded_metadata: ByteArray = bytes_base64_encode(metadata);
                (format!("data:application/json;base64,{}", base64_encoded_metadata))
            } else {
                (metadata)
            }
        }
    }

    //-----------------------------------
    // Private
    //
    #[generate_trait]
    impl TokenCommandNexusInternalImpl of TokenCommandNexusInternalTrait {
        fn format_name(self: @command_nexustate, token_id: u256, CommandNexus: CommandNexus) -> ByteArray {
            let name: ByteArray = if (CommandNexus.name != '') { CommandNexus.name.to_byte_array() } else { "CommandNexus" };
            (format!("{} #{}", name, token_id))
        }
        
        fn format_description(self: @command_nexustate, token_id: u256, _CommandNexus: CommandNexus) -> ByteArray {
            (format!("Command Nexus - Dominate #{}", token_id))
        }
        
        fn format_image(self: @command_nexustate, CommandNexus: CommandNexus, variant: ByteArray) -> ByteArray {
            let base_uri: ByteArray = self.erc721_metadata.get_meta().base_uri;
            let number =
                if (CommandNexus.profile_pic_uri.len() == 0) {"00"}
                else if (CommandNexus.profile_pic_uri.len() == 1) {format!("0{}", CommandNexus.profile_pic_uri)}
                else {CommandNexus.profile_pic_uri};
            (format!("{}/profiles/{}_{}.jpg", base_uri, number, variant))
        }


        fn format_metadata(self: @command_nexustate, attributes: Span<ByteArray>) -> ByteArray {
            let mut json = JsonImpl::new();
            let mut n: usize = 0;
            loop {
                if (n >= attributes.len()) { break; }
                let name = attributes.at(n).into();
                let value = attributes.at(n+1).into();
                json = json.add(name, value);
                n += 2;
            };
            let result = json.build();
            (result)
        }

        fn format_traits_array(self: @command_nexustate, attributes: Span<ByteArray>) -> Span<ByteArray> {
            let mut result: Array<ByteArray> = array![];
            let mut n: usize = 0;
            loop {
                if (n >= attributes.len()) { break; }
                let name = attributes.at(n).into();
                let value = attributes.at(n+1).into();
                let json = JsonImpl::new()
                    .add("trait", name)
                    .add("value", value);
                result.append(json.build());
                n += 2;
            };
            (result.span())
        }
    }
}
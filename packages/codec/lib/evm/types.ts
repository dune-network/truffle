import * as Common from "@dune-network/codec/common";
import * as Storage from "@dune-network/codec/storage/types";
import * as Ast from "@dune-network/codec/ast";
import {
  StorageAllocations,
  StateAllocations
} from "@dune-network/codec/storage/allocate/types";
import { MemoryAllocations } from "@dune-network/codec/memory/allocate/types";
import {
  AbiAllocations,
  CalldataAllocations,
  EventAllocations
} from "@dune-network/codec/abi-data/allocate/types";
import * as Contexts from "@dune-network/codec/contexts/types";
import * as Format from "@dune-network/codec/format";

export interface EvmState {
  storage: WordMapping;
  stack?: Uint8Array[];
  memory?: Uint8Array;
  calldata?: Uint8Array;
  specials?: {
    [builtin: string]: Uint8Array; //sorry
  };
  eventdata?: Uint8Array;
  eventtopics?: Uint8Array[];
  returndata?: Uint8Array;
}

export interface WordMapping {
  [slotAddress: string]: Uint8Array;
}

export interface EvmInfo {
  state: EvmState;
  mappingKeys?: Storage.Slot[];
  userDefinedTypes?: Format.Types.TypesById;
  allocations: AllocationInfo;
  contexts?: Contexts.DecoderContexts;
  currentContext?: Contexts.DecoderContext;
  internalFunctionsTable?: InternalFunctions;
}

export interface AllocationInfo {
  storage?: StorageAllocations;
  memory?: MemoryAllocations;
  abi?: AbiAllocations;
  calldata?: CalldataAllocations;
  event?: EventAllocations;
  state?: StateAllocations;
}

export interface InternalFunctions {
  [pc: number]: InternalFunction;
}

export interface InternalFunction {
  sourceIndex?: number;
  compilationId?: string;
  pointer?: string;
  node?: Ast.AstNode;
  name?: string;
  id?: number;
  mutability?: Common.Mutability;
  contractPointer?: string;
  contractNode?: Ast.AstNode;
  contractName?: string;
  contractId?: number;
  contractKind?: Common.ContractKind;
  contractPayable?: boolean;
  isDesignatedInvalid: boolean;
}

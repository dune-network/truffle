import debugModule from "debug";
const debug = debugModule("codec:topic:decode");

import read from "@dune-network/codec/read";
import * as Basic from "@dune-network/codec/basic";
import * as Format from "@dune-network/codec/format";
import * as Conversion from "@dune-network/codec/conversion";
import * as Pointer from "@dune-network/codec/pointer";
import { DecoderRequest, DecoderOptions } from "@dune-network/codec/types";
import * as Evm from "@dune-network/codec/evm";

export function* decodeTopic(
  dataType: Format.Types.Type,
  pointer: Pointer.EventTopicPointer,
  info: Evm.EvmInfo,
  options: DecoderOptions = {}
): Generator<DecoderRequest, Format.Values.Result, Uint8Array> {
  if (
    Format.Types.isReferenceType(dataType) ||
    dataType.typeClass === "tuple"
  ) {
    //we cannot decode reference types "stored" in topics; we have to just return an error
    let bytes: Uint8Array = yield* read(pointer, info.state);
    let raw: string = Conversion.toHexString(bytes);
    //NOTE: even in strict mode we want to just return this, not throw an error here
    return <Format.Errors.ErrorResult>{
      //dunno why TS is failing here
      type: dataType,
      kind: "error" as const,
      error: {
        kind: "IndexedReferenceTypeError" as const,
        type: dataType,
        raw
      }
    };
  }
  //otherwise, dispatch to decodeBasic
  return yield* Basic.Decode.decodeBasic(dataType, pointer, info, options);
}

import debugModule from "debug";
const debug = debugModule("codec:ast:decode");

import read from "@dune-network/codec/read";
import * as Conversion from "@dune-network/codec/conversion";
import * as Format from "@dune-network/codec/format";
import * as Pointer from "@dune-network/codec/pointer";
import * as Basic from "@dune-network/codec/basic";
import * as Bytes from "@dune-network/codec/bytes";
import { DecoderRequest } from "@dune-network/codec/types";
import * as Evm from "@dune-network/codec/evm";
import { DecodingError } from "@dune-network/codec/errors";

export function* decodeConstant(
  dataType: Format.Types.Type,
  pointer: Pointer.ConstantDefinitionPointer,
  info: Evm.EvmInfo
): Generator<DecoderRequest, Format.Values.Result, Uint8Array> {
  debug("pointer %o", pointer);

  //normally, we just dispatch to decodeBasic or decodeBytes.
  //for statically-sized bytes, however, we need to make a special case.
  //you see, decodeBasic expects to find the bytes at the *beginning*
  //of the word, but readDefinition will put them at the *end* of the
  //word.  So we'll have to adjust things ourselves.

  if (dataType.typeClass === "bytes" && dataType.kind === "static") {
    let size = dataType.length;
    let word: Uint8Array;
    try {
      word = yield* read(pointer, info.state);
    } catch (error) {
      return {
        type: dataType,
        kind: "error" as const,
        error: (<DecodingError>error).error
      };
    }
    //not bothering to check padding; shouldn't be necessary
    let bytes = word.slice(Evm.Utils.WORD_SIZE - size);
    return {
      type: dataType,
      kind: "value" as const,
      value: {
        asHex: Conversion.toHexString(bytes)
      }
    }; //we'll skip including a raw value, as that would be meaningless
  }

  //otherwise, as mentioned, just dispatch to decodeBasic or decodeBytes
  debug("not a static bytes");
  if (dataType.typeClass === "bytes" || dataType.typeClass === "string") {
    return yield* Bytes.Decode.decodeBytes(dataType, pointer, info);
  }
  return yield* Basic.Decode.decodeBasic(dataType, pointer, info);
}

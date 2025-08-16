/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  type InputValueVO,
  type NodeDataDTO,
  type ViewVariableMeta,
  type BlockInput,
  type VariableMetaDTO,
} from '@coze-workflow/base';
import { TrimMethod } from './constants';

export interface NodeMeta {
  title: string;
  icon: string;
  subTitle: string;
  description: string;
  mainColor: string;
}

export interface TrimmerFormData {
  method: TrimMethod;
  customChars?: string;
  inputParameters: InputValueVO[];
  nodeMeta: NodeMeta;
  outputs: ViewVariableMeta[];
}

export interface TrimmerNodeData {
  trimParams?: Array<{
    name: string;
    input: {
      value: {
        content: string;
      };
    };
  }>;
}

/** backend data structure */
export interface BackendData extends NodeDataDTO {
  nodeMeta: NodeMeta;
  inputs: NodeDataDTO['inputs'] & {
    // trim parameter
    method?: TrimMethod;
  };
  outputs: VariableMetaDTO[];
}

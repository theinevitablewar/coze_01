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

import { ViewVariableType } from '@coze-workflow/base';
import { I18n } from '@coze-arch/i18n';

import { NodeConfigForm } from '@/node-registries/common/components';
import { useWatch } from '@/form';

import { OutputsField } from '../common/fields';
import { InputParameters } from '../common/components';
import { TrimMethod, TRIM_METHOD_OPTIONS, COMMON_CUSTOM_CHARS } from './constants';
import {
  MethodSelectorSetter,
  Inputs,
  // ConcatSetting,
  // DelimiterSelectorField,
} from './components';
import {CONCAT_DEFAULT_INPUTS} from "@/node-registries/text-process/constants";

const Render = () => {
  // 监听去空格方法变化
  const method = useWatch<TrimMethod>({ name: 'method' });

  // 是否需要自定义字符
  const needCustomChars = method === TrimMethod.Custom;

  return (
    <NodeConfigForm>
      {/* Select string application */}
      <MethodSelectorSetter name="method" />

      {/* 输入参数 */}
      <Inputs
        name="inputParameters"
        defaultValue={CONCAT_DEFAULT_INPUTS}
        minItems={1}
        maxItems={ Number.MAX_SAFE_INTEGER}
        inputType={ViewVariableType.String}
        disabledTypes={
          []
        }
      />

      {/* 输出参数 */}
      <OutputsField
        name="outputs"
        title={I18n.t('workflow_detail_node_output')}
        tooltip={I18n.t('workflow.node.text-trimmer.output.tooltip')}
        id="text-trimmer-node-output"
        topLevelReadonly={true}
        customReadonly
      />
    </NodeConfigForm>
  );
};

export default Render;

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
import {TrimMethod, TRIM_METHOD_OPTIONS, COMMON_CUSTOM_CHARS, TRIMMER_DEFAULT_INPUTS} from './constants';
import {
  MethodSelectorSetter,
  // 使用 text-process 的 Inputs 组件
} from './components';
// 导入 text-process 的 Inputs 组件
import { Inputs } from '../text-process/components';

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
        defaultValue={TRIMMER_DEFAULT_INPUTS}
        // TextTrimmer 只需要一个字符串输入
        minItems={1}
        maxItems={1}
        // 只能输入字符串类型
        inputType={ViewVariableType.String}
        disabledTypes={ViewVariableType.getComplement([ViewVariableType.String])}
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

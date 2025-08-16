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
  type Effect,
  FlowNodeFormData,
  type FormModelV2,
} from '@flowgram-adapter/free-layout-editor';

import { getDefaultOutput } from '../utils';
import { TRIMMER_DEFAULT_INPUTS } from '../constants';

export const handleMethodChangeEffect: Effect = props => {
  const { value, context } = props;
  const { node } = context;

  const formModel = node.getData(FlowNodeFormData).getFormModel();

  if (!formModel) {
    return;
  }

  // 总是设置默认输出
  formModel.setValueIn('outputs', getDefaultOutput());

  // 总是设置默认输入参数 - 无论方法如何变化
  const currentInputs = formModel.getValueIn('inputParameters');
  if (!currentInputs || currentInputs.length === 0) {
    formModel.setValueIn('inputParameters', TRIMMER_DEFAULT_INPUTS);
  }
};

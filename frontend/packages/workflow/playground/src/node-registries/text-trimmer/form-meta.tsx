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

import { I18n } from '@coze-arch/i18n';
import {
  ValidateTrigger,
  type FormMetaV2,
  DataEvent,
} from '@flowgram-adapter/free-layout-editor';

import { provideNodeOutputVariablesEffect } from '@/nodes-v2/materials/provide-node-output-variables';
import { nodeMetaValidate } from '@/nodes-v2/materials/node-meta-validate';
import { fireNodeTitleChange } from '@/nodes-v2/materials/fire-node-title-change';

import { createValueExpressionInputValidate } from '../common/validators';
import Render from './form';
import { formatOnInit, formatOnSubmit } from './data-transformer';
import { TrimMethod } from './constants';
import { type TrimmerFormData } from './types';

export const FORM_META: FormMetaV2<TrimmerFormData> = {
  render: () => <Render />,
  validateTrigger: ValidateTrigger.onChange,
  validate: {
    nodeMeta: nodeMetaValidate,
    // 检查输入参数
    'inputParameters.*.input': createValueExpressionInputValidate({
      required: true,
    }),
    // 验证自定义字符
    customChars: ({ value, formValues }) => {
      // 只有自定义模式才验证自定义字符
      if (formValues?.method !== TrimMethod.Custom) {
        return undefined;
      }

      return !value?.length
        ? I18n.t('workflow.node.text-trimmer.customChars.required')
        : undefined;
    },
  },
  effects: [
    // 节点标题变化
    fireNodeTitleChange,
    // 提供节点输出变量
    provideNodeOutputVariablesEffect,
  ],
  transformer: {
    onInit: formatOnInit,
    onSubmit: formatOnSubmit,
  },
};

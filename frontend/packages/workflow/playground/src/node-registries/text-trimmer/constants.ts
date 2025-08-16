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

export enum TrimMethod {
  LeadingTrailing = 'leadingTrailing',
  All = 'all',
  Leading = 'leading',
  Trailing = 'trailing',
  Custom = 'custom',
}

export const PREFIX_STR = 'TextTrimmer';

/** 前端表单字段名 */
export const FIELD_NAME_MAP = {
  method: 'method',
  customChars: 'customChars',
  outputs: 'outputs',
};

/** 后端字段名 */
export const BACK_END_NAME_MAP = {
  trimType: 'trimType',
  customChars: 'customChars',
};

/** 文本去空格方法选项 */
export const TRIM_METHOD_OPTIONS = [
  {
    label: I18n.t('workflow.node.text-trimmer.method.leadingTrailing'),
    value: TrimMethod.LeadingTrailing,
    description: I18n.t('workflow.node.text-trimmer.method.leadingTrailingDesc'),
  },
  {
    label: I18n.t('workflow.node.text-trimmer.method.all'),
    value: TrimMethod.All,
    description: I18n.t('workflow.node.text-trimmer.method.allDesc'),
  },
  {
    label: I18n.t('workflow.node.text-trimmer.method.leading'),
    value: TrimMethod.Leading,
    description: I18n.t('workflow.node.text-trimmer.method.leadingDesc'),
  },
  {
    label: I18n.t('workflow.node.text-trimmer.method.trailing'),
    value: TrimMethod.Trailing,
    description: I18n.t('workflow.node.text-trimmer.method.trailingDesc'),
  },
  {
    label: I18n.t('workflow.node.text-trimmer.method.custom'),
    value: TrimMethod.Custom,
    description: I18n.t('workflow.node.text-trimmer.method.customDesc'),
  },
];

/** 常用的自定义字符 */
export const COMMON_CUSTOM_CHARS = [
  { label: '空格', value: ' ' },
  { label: '制表符', value: '\t' },
  { label: '换行符', value: '\n' },
  { label: '回车符', value: '\r' },
  { label: '标点符号', value: '.,;:!?' },
  { label: '数字', value: '0123456789' },
];

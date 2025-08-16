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

import { get } from 'lodash-es';
import { BlockInput, type InputValueDTO, ViewVariableType } from '@coze-workflow/base';

import { TrimMethod, BACK_END_NAME_MAP, FIELD_NAME_MAP } from './constants';
import { type TrimmerFormData, type TrimmerNodeData } from './types';

/**
 * 在 InputValueDTO 中查找字段
 * @param params
 * @param name
 * @returns
 */
function getParam(params: InputValueDTO[], name: string) {
  return params.find(item => item.name === name);
}

/**
 * 获取默认输出
 * @returns
 */
function getDefaultOutput() {
  return [
    {
      id: 'output',
      name: 'output',
      type: ViewVariableType.String,
      editable: false,
    },
  ];
}

/**
 * 后端数据 -> 前端表单数据
 * @param value
 * @returns
 */
export const formatOnInit = (value: any): TrimmerFormData => {
  // 初始化时没有值，返回默认设置
  if (!value) {
    return {
      method: TrimMethod.LeadingTrailing,
      inputParameters: [],
      outputs: getDefaultOutput(),
      nodeMeta: undefined,
    };
  }

  const { nodeMeta, inputs, outputs } = value;
  const { trimParams } = inputs || {};

  const baseValue: TrimmerFormData = {
    method: TrimMethod.LeadingTrailing,
    nodeMeta,
    outputs: outputs || getDefaultOutput(),
    inputParameters: inputs?.inputParameters || [],
  };

  // 从 trimParams 中获取配置
  if (Array.isArray(trimParams)) {
    const trimTypeParam = getParam(trimParams, BACK_END_NAME_MAP.trimType);
    const customCharsParam = getParam(trimParams, BACK_END_NAME_MAP.customChars);

    if (trimTypeParam) {
      baseValue.method = BlockInput.toLiteral(trimTypeParam) as TrimMethod;
    }

    if (customCharsParam) {
      baseValue.customChars = BlockInput.toLiteral(customCharsParam) as string;
    }
  }

  return baseValue;
};

/**
 * 前端表单数据 -> 后端数据
 * @param value
 * @returns
 */
export const formatOnSubmit = (value: TrimmerFormData): any => {
  const { method, customChars, inputParameters, nodeMeta, outputs } = value;

  const trimParams: InputValueDTO[] = [
    {
      name: BACK_END_NAME_MAP.trimType,
      input: BlockInput.fromLiteral(method),
    },
  ];

  // 如果是自定义模式，添加自定义字符参数
  if (method === TrimMethod.Custom && customChars) {
    trimParams.push({
      name: BACK_END_NAME_MAP.customChars,
      input: BlockInput.fromLiteral(customChars),
    });
  }

  return {
    nodeMeta,
    inputs: {
      inputParameters,
      trimParams,
    },
    outputs,
  };
};

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

import {get} from 'lodash-es';
import {BlockInput, type InputValueDTO, ViewVariableType} from '@coze-workflow/base';

import {TrimMethod, BACK_END_NAME_MAP, FIELD_NAME_MAP, TRIMMER_DEFAULT_INPUTS} from './constants';
import {type TrimmerFormData, type TrimmerNodeData} from './types';
import {getDefaultOutput} from './utils';
import type {BackendData} from "@/node-registries/text-trimmer/types";

/**
 * 在 InputValueDTO 中查找字段
 * @param params
 * @param name
 * @returns
 */
function getParam(params: InputValueDTO[], name: string) {
  if (!Array.isArray(params)) return undefined;
  for (let i = 0; i < params.length; i++) {
    if ((params[i] as any).name === name) {
      return params[i];
    }
  }
  return undefined;
}

/**
 * 后端数据 -> 前端表单数据
 * @param value
 * @returns
 */
export const formatOnInit = (value: any): TrimmerFormData => {
  console.info("TextTrimmer formatOnInit called with value:", value);

  // 初始化时没有值，返回默认设置
  if (!value) {
    const defaultData = {
      method: TrimMethod.LeadingTrailing,
      inputParameters: TRIMMER_DEFAULT_INPUTS,
      outputs: getDefaultOutput(),
      nodeMeta: {
        title: '文本去空格',
        icon: '',
        description: '去除文本中的空格字符',
        mainColor: '#3071F2',
        subTitle: '文本去空格'
      },
    };
    console.info("TextTrimmer formatOnInit returning default data:", defaultData);
    return defaultData;
  }
  console.info("value -=-->", value);
  const {nodeMeta, inputs, outputs} = value;
  const {trimParams} = inputs || {};

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
 * Find a field in InputValueDTO
 * @param params
 * @param name
 * @returns
 */
function getParam(params: InputValueDTO[], name: string) {
  return params.find(item => item.name === name);
}

/**
 * 前端表单数据 -> 后端数据
 * @param value
 * @returns
 */
export const formatOnSubmit = (value: TrimmerFormData): any => {
  const {method, customChars, inputParameters, nodeMeta, outputs} = value;

  const trimParams: any[] = [
    // 去空格类型
    BlockInput.createString(BACK_END_NAME_MAP.trimType, method),
  ];

  // 如果是自定义模式，添加自定义字符参数
  if (method === TrimMethod.Custom && customChars) {
    trimParams.push(
      BlockInput.createString(BACK_END_NAME_MAP.customChars, customChars)
    );
  }

  const result = {
    nodeMeta,
    inputs: {
      method,
      inputParameters,
      trimParams,
    },
    outputs,
  };

  console.info(result, "baseValue text-trimmer.baseValue");
  return result;
};

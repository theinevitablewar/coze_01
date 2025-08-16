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

package texttrimmer

import (
	"context"
	"fmt"
	"strings"

	"github.com/coze-dev/coze-studio/backend/domain/workflow/entity"
	"github.com/coze-dev/coze-studio/backend/domain/workflow/entity/vo"
	"github.com/coze-dev/coze-studio/backend/domain/workflow/internal/canvas/convert"
	"github.com/coze-dev/coze-studio/backend/domain/workflow/internal/nodes"
	"github.com/coze-dev/coze-studio/backend/domain/workflow/internal/schema"
)

type TrimType string

const (
	TrimLeadingTrailing TrimType = "leadingTrailing" // 去除首尾空格
	TrimAll             TrimType = "all"             // 去除所有空格
	TrimLeading         TrimType = "leading"         // 去除开头空格
	TrimTrailing        TrimType = "trailing"        // 去除结尾空格
	TrimCustom          TrimType = "custom"          // 自定义去除字符
)

type Config struct {
	Type        TrimType `json:"type"`        // 去空格类型
	CustomChars string   `json:"customChars"` // 自定义要去除的字符
}

func (c *Config) Adapt(ctx context.Context, n *vo.Node, opts ...nodes.AdaptOption) (*schema.NodeSchema, error) {
	ns := &schema.NodeSchema{
		Key:     vo.NodeKey(n.ID),
		Type:    entity.NodeTypeTextTrimmer,
		Name:    n.Data.Meta.Title,
		Configs: c,
	}

	// 从前端配置中获取去空格类型
	if n.Data.Inputs != nil && n.Data.Inputs.TrimParams != nil && len(n.Data.Inputs.TrimParams) > 0 {
		for _, param := range n.Data.Inputs.TrimParams {
			if param == nil || param.Input == nil || param.Input.Value == nil {
				continue // 跳过空的参数
			}

			if param.Name == "trimType" {
				if content, ok := param.Input.Value.Content.(string); ok {
					c.Type = TrimType(content)
				}
			} else if param.Name == "customChars" {
				if content, ok := param.Input.Value.Content.(string); ok {
					c.CustomChars = content
				}
			}
		}
	}

	// 如果没有设置类型，使用默认值
	if c.Type == "" {
		c.Type = TrimLeadingTrailing
	}

	if err := convert.SetInputsForNodeSchema(n, ns); err != nil {
		return nil, err
	}

	if err := convert.SetOutputTypesForNodeSchema(n, ns); err != nil {
		return nil, err
	}

	return ns, nil
}

func (c *Config) Build(_ context.Context, ns *schema.NodeSchema, _ ...schema.BuildOption) (any, error) {
	return &TextTrimmer{
		trimType:    c.Type,
		customChars: c.CustomChars,
	}, nil
}

type TextTrimmer struct {
	trimType    TrimType
	customChars string
}

const OutputKey = "output"

func (t *TextTrimmer) Invoke(ctx context.Context, input map[string]any) (map[string]any, error) {
	// 获取输入文本 - 使用与 textprocessor 相同的参数名
	value, ok := input["String1"]
	if !ok {
		return nil, fmt.Errorf("input string required")
	}

	valueString, ok := value.(string)
	if !ok {
		return nil, fmt.Errorf("input string field must be string type but got %T", value)
	}

	var result string
	switch t.trimType {
	case TrimLeadingTrailing:
		result = strings.TrimSpace(valueString)
	case TrimAll:
		result = strings.ReplaceAll(valueString, " ", "")
		// 也去除制表符和换行符
		result = strings.ReplaceAll(result, "\t", "")
		result = strings.ReplaceAll(result, "\n", "")
		result = strings.ReplaceAll(result, "\r", "")
	case TrimLeading:
		result = strings.TrimLeftFunc(valueString, func(r rune) bool {
			return r == ' ' || r == '\t' || r == '\n' || r == '\r'
		})
	case TrimTrailing:
		result = strings.TrimRightFunc(valueString, func(r rune) bool {
			return r == ' ' || r == '\t' || r == '\n' || r == '\r'
		})
	case TrimCustom:
		if t.customChars == "" {
			result = strings.TrimSpace(valueString)
		} else {
			result = strings.Trim(valueString, t.customChars)
		}
	default:
		return nil, fmt.Errorf("unsupported trim type: %s", t.trimType)
	}

	return map[string]any{OutputKey: result}, nil
}

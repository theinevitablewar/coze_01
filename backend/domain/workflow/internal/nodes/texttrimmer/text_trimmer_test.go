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
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTextTrimmer_TrimLeadingTrailing(t *testing.T) {
	trimmer := &TextTrimmer{
		trimType: TrimLeadingTrailing,
	}

	input := map[string]any{
		"String": "  hello world  ",
	}

	result, err := trimmer.Invoke(context.Background(), input)
	assert.NoError(t, err)
	assert.Equal(t, "hello world", result[OutputKey])
}

func TestTextTrimmer_TrimAll(t *testing.T) {
	trimmer := &TextTrimmer{
		trimType: TrimAll,
	}

	input := map[string]any{
		"String": "  hello\tworld\n  ",
	}

	result, err := trimmer.Invoke(context.Background(), input)
	assert.NoError(t, err)
	assert.Equal(t, "helloworld", result[OutputKey])
}

func TestTextTrimmer_TrimLeading(t *testing.T) {
	trimmer := &TextTrimmer{
		trimType: TrimLeading,
	}

	input := map[string]any{
		"String": "  hello world  ",
	}

	result, err := trimmer.Invoke(context.Background(), input)
	assert.NoError(t, err)
	assert.Equal(t, "hello world  ", result[OutputKey])
}

func TestTextTrimmer_TrimTrailing(t *testing.T) {
	trimmer := &TextTrimmer{
		trimType: TrimTrailing,
	}

	input := map[string]any{
		"String": "  hello world  ",
	}

	result, err := trimmer.Invoke(context.Background(), input)
	assert.NoError(t, err)
	assert.Equal(t, "  hello world", result[OutputKey])
}

func TestTextTrimmer_TrimCustom(t *testing.T) {
	trimmer := &TextTrimmer{
		trimType:    TrimCustom,
		customChars: ".,!",
	}

	input := map[string]any{
		"String": "...hello world!!!",
	}

	result, err := trimmer.Invoke(context.Background(), input)
	assert.NoError(t, err)
	assert.Equal(t, "hello world", result[OutputKey])
}

func TestTextTrimmer_InvalidInput(t *testing.T) {
	trimmer := &TextTrimmer{
		trimType: TrimLeadingTrailing,
	}

	// 测试缺少输入
	input := map[string]any{}
	_, err := trimmer.Invoke(context.Background(), input)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "input string required")

	// 测试错误类型
	input = map[string]any{
		"String": 123,
	}
	_, err = trimmer.Invoke(context.Background(), input)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "input string field must be string type")
}

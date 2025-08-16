基于我对项目的分析，让我为您总结这个 Coze Studio 项目中的工作流相关内容：

## 🔄 Coze Studio 工作流系统概览

这个项目是一个名为 **Coze Studio** 的工作流管理系统，具有完整的前后端架构。以下是工作流相关的核心内容：

### 📋 **主要组件结构**

#### **1. 后端架构 (Backend)**
- **领域层** (`backend/domain/workflow/`)
  - **实体类** (`entity/`): 工作流、节点、执行状态等核心数据模型
  - **服务层** (`service/`): 工作流的业务逻辑处理
  - **仓储层**: 数据持久化接口

- **应用层** (`backend/application/workflow/`)
  - 工作流应用服务，协调不同领域服务
  - 与其他模块(插件、知识库、内存等)的集成

- **接口定义** (`idl/workflow/`)
  - **工作流Thrift定义**: 完整的API接口规范
  - **追踪系统**: 执行历史和调试功能

#### **2. 前端架构 (Frontend)**
- **工作流IDE** (`frontend/packages/agent-ide/workflow/`)
- **工作流组件库** (`frontend/packages/workflow/components/`)
- **可视化画布**: 基于React的拖拽式工作流编辑器

### 🔧 **核心功能特性**

#### **1. 工作流类型**
```go
enum WorkflowMode {
    Workflow  = 0   ,  // 标准工作流
    Imageflow = 1   ,  // 图像处理流
    SceneFlow = 2   ,  // 场景流
    ChatFlow  = 3   ,  // 对话流
    All       = 100 ,  // 查询时使用
}
```

#### **2. 节点类型系统**
- **代码节点** (`code/`): Python代码执行，支持沙箱环境
- **HTTP请求节点** (`httprequester/`): API调用功能
- **选择器节点** (`selector/`): 条件分支逻辑
- **变量赋值节点** (`variableassigner/`): 数据变换处理
- **插件节点**: 集成第三方服务
- **大语言模型节点**: AI对话和文本处理

#### **3. 执行引擎**
- **实时执行**: 支持同步和异步执行模式
- **流式处理**: 支持流式输出和实时反馈
- **错误处理**: 完善的异常捕获和恢复机制
- **执行历史**: 详细的执行记录和调试信息

#### **4. 工作流管理**
```go
type Workflow struct {
    ID       int64
    CommitID string
    *vo.Meta            // 元数据信息
    *vo.CanvasInfo      // 画布布局信息
    *vo.DraftMeta       // 草稿版本信息
    *vo.VersionMeta     // 版本管理信息
}
```

### 🎯 **主要API接口**

#### **核心操作**
- **创建工作流**: `CreateWorkflow`
- **保存工作流**: `SaveWorkflow`
- **发布工作流**: `PublishWorkflow`
- **复制工作流**: `CopyWorkflow`
- **删除工作流**: `DeleteWorkflow`

#### **执行相关**
- **测试运行**: `WorkFlowTestRun`
- **取消执行**: `CancelWorkFlow`
- **获取执行状态**: `GetWorkFlowProcess`
- **节点调试**: `WorkflowNodeDebugV2`

#### **Open API**
- **流式运行**: `OpenAPIStreamRunFlow`
- **恢复执行**: `OpenAPIStreamResumeFlow`
- **聊天流**: `OpenAPIChatFlowRun`

## 📝 Coze Studio TextProcessor 节点详细分析

基于我对项目的深入分析，TextProcessor 节点（在前端称为 Text 节点）是 Coze Studio 工作流系统中的核心文本处理节点。以下是完整的技术分析：

### 🔧 **后端实现**

#### **1. 核心实体定义**
```go
// 节点类型定义 (backend/domain/workflow/entity/node_meta.go)
NodeTypeTextProcessor NodeType = "TextProcessor"

// 配置结构体 (backend/domain/workflow/internal/nodes/textprocessor/text_processor.go)
type Config struct {
    Type       Type     `json:"type"`        // 处理类型：concat/split
    Tpl        string   `json:"tpl"`         // 拼接模板
    ConcatChar string   `json:"concatChar"`  // 拼接字符
    Separators []string `json:"separator"`   // 分割符列表
}

// 处理器结构体
type TextProcessor struct {
    typ         Type
    tpl         string
    concatChar  string
    separators  []string
    fullSources map[string]*schema.SourceInfo
}
```

#### **2. 处理类型**
```go
type Type string

const (
    ConcatText Type = "concat"  // 文本拼接
    SplitText  Type = "split"   // 文本分割
)
```

#### **3. 核心功能实现**
- **文本拼接模式**：
  - 支持模板语法 `{{变量名}}`
  - 支持数组元素的自定义连接符
  - 支持 JSON 对象的序列化处理

- **文本分割模式**：
  - 支持多个分割符同时使用
  - 按分割符顺序依次分割文本
  - 输出为字符串数组

#### **4. 节点适配器**
```go
func (c *Config) Adapt(ctx context.Context, n *vo.Node, opts ...nodes.AdaptOption) (*schema.NodeSchema, error)
func (c *Config) Build(_ context.Context, ns *schema.NodeSchema, _ ...schema.BuildOption) (any, error)
```

### 🎨 **前端实现**

#### **1. 节点类型映射**
```typescript
// 前端节点类型 (frontend/packages/workflow/base/src/types/node-type.ts)
export enum StandardNodeType {
  Text = '15',  // 对应后端的 TextProcessor
}

// IDL 定义 (idl/workflow/workflow.thrift)
enum NodeType {
    Text = 15,
}
```

#### **2. 表单配置**
```tsx
// 处理方法选项 (frontend/packages/workflow/playground/src/node-registries/text-process/constants.ts)
export enum StringMethod {
  Concat = 'concat',  // 拼接
  Split = 'split',    // 分割
}

// 表单字段映射
export const FIELD_NAME_MAP = {
  method: 'method',           // 处理方法
  concatResult: 'concatResult',  // 拼接内容
  delimiter: 'delimiter',     // 分割符
  concatChar: 'concatChar',   // 拼接字符
  outputs: 'outputs',         // 输出变量
};
```

#### **3. 前端数据结构**
```typescript
// 基础表单数据
interface FormData {
  method: StringMethod;
  inputParameters: InputValueVO[];
  nodeMeta: NodeMeta;
  outputs: ViewVariableMeta[];
}

// 分割模式表单数据
interface DelimiterModeFormData extends FormData {
  delimiter: {
    value: string[];           // 分割符列表
    options: DelimiterOption[]; // 分割符选项
  };
}

// 拼接模式表单数据
interface ConcatModeFormData extends FormData {
  concatChar: {
    value: string;             // 拼接字符
    options: DelimiterOption[]; // 拼接字符选项
  };
  concatResult: string;        // 拼接模板内容
}
```

### 🎯 **功能特性详解**

#### **1. 文本拼接功能**
- **模板语法**：支持 `{{变量名}}` 形式的变量引用
- **数组处理**：自动将数组元素用指定字符连接
- **对象处理**：自动将对象序列化为 JSON 字符串
- **类型转换**：自动将各种类型转换为字符串

#### **2. 文本分割功能**
- **多分割符**：支持同时使用多个分割符
- **顺序分割**：按分割符顺序依次进行分割
- **灵活配置**：支持自定义分割符和预设选项

#### **3. 用户界面特性**
- **动态表单**：根据处理方法动态显示不同的配置项
- **实时预览**：支持实时查看处理结果
- **验证机制**：完整的输入验证和错误提示
- **多语言支持**：完整的国际化支持

### 📊 **使用示例**

#### **拼接模式示例**
```go
// 输入数据
input := map[string]any{
    "a": []any{"1", map[string]any{"1": 1}, 3},
    "b": map[string]any{
        "b1": []string{"1", "2", "3"},
        "b2": []any{"1", 2, "3"},
    },
    "c": map[string]any{"c1": "1"},
}

// 配置
config := &Config{
    Type:       ConcatText,
    ConcatChar: `\t`,
    Tpl:        "fx{{a}}=={{b.b1}}=={{b.b2[1]}}=={{c}}",
}

// 输出结果
// "fx1\t{\"1\":1}\t3==1\t2\t3==2=={\"c1\":\"1\"}"
```

#### **分割模式示例**
```go
// 输入数据
input := map[string]any{
    "String": "a,b|c.d,e|f|g",
}

// 配置
config := &Config{
    Type:       SplitText,
    Separators: []string{",", "|", "."},
}

// 输出结果
// []any{"a", "b", "c", "d", "e", "f", "g"}
```

### 🔄 **工作流集成**

TextProcessor 节点在工作流中具有重要作用：
- **数据预处理**：为其他节点准备格式化的文本数据
- **数据转换**：在不同数据格式之间进行转换
- **文本操作**：提供灵活的文本处理能力
- **流程控制**：通过文本处理结果影响后续流程

这个节点设计精良，既提供了强大的功能，又保持了良好的用户体验，是 Coze Studio 工作流系统中不可或缺的组件。

## 📝 Coze Studio TextTrimmer 节点详细分析

基于 TextProcessor 节点的设计理念，我新增了一个 **TextTrimmer** 节点，专门用于文本去空格处理。以下是完整的技术实现：

### 🔧 **后端实现**

#### **1. 核心实体定义**
```go
// 节点类型定义 (backend/domain/workflow/entity/node_meta.go)
NodeTypeTextTrimmer NodeType = "TextTrimmer"

// 配置结构体 (backend/domain/workflow/internal/nodes/texttrimmer/text_trimmer.go)
type Config struct {
    Type        TrimType `json:"type"`        // 去空格类型
    CustomChars string   `json:"customChars"` // 自定义要去除的字符
}

// 处理器结构体
type TextTrimmer struct {
    trimType    TrimType
    customChars string
}
```

#### **2. 处理类型**
```go
type TrimType string

const (
    TrimLeadingTrailing TrimType = "leadingTrailing" // 去除首尾空格
    TrimAll             TrimType = "all"             // 去除所有空格
    TrimLeading         TrimType = "leading"         // 去除开头空格
    TrimTrailing        TrimType = "trailing"        // 去除结尾空格
    TrimCustom          TrimType = "custom"          // 自定义去除字符
)
```

#### **3. 核心功能实现**
- **首尾空格模式**：使用 `strings.TrimSpace()` 去除首尾的空格、制表符、换行符
- **全部空格模式**：去除所有空格、制表符、换行符和回车符
- **开头空格模式**：仅去除文本开头的空白字符
- **结尾空格模式**：仅去除文本结尾的空白字符
- **自定义字符模式**：使用 `strings.Trim()` 去除用户指定的字符

#### **4. 节点适配器**
```go
func (c *Config) Adapt(ctx context.Context, n *vo.Node, opts ...nodes.AdaptOption) (*schema.NodeSchema, error)
func (c *Config) Build(_ context.Context, ns *schema.NodeSchema, _ ...schema.BuildOption) (any, error)
```

### 🎨 **前端实现**

#### **1. 节点类型映射**
```typescript
// 前端节点类型 (frontend/packages/workflow/base/src/types/node-type.ts)
export enum StandardNodeType {
  TextTrimmer = '61',  // 对应后端的 TextTrimmer
}

// IDL 定义 (idl/workflow/workflow.thrift)
enum NodeType {
    TextTrimmer = 61,
}
```

#### **2. 表单配置**
```tsx
// 处理方法选项 (frontend/packages/workflow/playground/src/node-registries/text-trimmer/constants.ts)
export enum TrimMethod {
  LeadingTrailing = 'leadingTrailing', // 去除首尾空格
  All = 'all',                         // 去除所有空格
  Leading = 'leading',                 // 去除开头空格
  Trailing = 'trailing',               // 去除结尾空格
  Custom = 'custom',                   // 自定义去除字符
}

// 表单字段映射
export const FIELD_NAME_MAP = {
  method: 'method',           // 处理方法
  customChars: 'customChars', // 自定义字符
  outputs: 'outputs',         // 输出变量
};
```

#### **3. 前端数据结构**
```typescript
// 基础表单数据
interface TrimmerFormData {
  method: TrimMethod;
  customChars?: string;
  inputParameters: InputValueVO[];
  nodeMeta: NodeMeta;
  outputs: ViewVariableMeta[];
}
```

### 🎯 **功能特性详解**

#### **1. 去空格功能**
- **首尾空格去除**：清理文本两端的空白字符，保留中间空格
- **全部空格去除**：移除文本中所有空白字符，包括空格、制表符、换行符
- **开头空格去除**：仅清理文本开头的空白字符
- **结尾空格去除**：仅清理文本结尾的空白字符
- **自定义字符去除**：用户可指定要去除的特定字符

#### **2. 用户界面特性**
- **动态表单**：根据处理方法动态显示自定义字符输入框
- **输入验证**：确保自定义模式下必须输入自定义字符
- **常用字符提示**：提供常用的自定义字符选项
- **实时反馈**：即时显示处理效果

### 📊 **使用示例**

#### **首尾空格模式示例**
```go
// 输入数据
input := map[string]any{
    "text": "  hello world  ",
}

// 配置
config := &Config{
    Type: TrimLeadingTrailing,
}

// 输出结果: "hello world"
```

#### **全部空格模式示例**
```go
// 输入数据
input := map[string]any{
    "text": "  hello\tworld\n  ",
}

// 配置
config := &Config{
    Type: TrimAll,
}

// 输出结果: "helloworld"
```

#### **自定义字符模式示例**
```go
// 输入数据
input := map[string]any{
    "text": "...hello world!!!",
}

// 配置
config := &Config{
    Type:        TrimCustom,
    CustomChars: ".,!",
}

// 输出结果: "hello world"
```

### 🔄 **工作流集成**

TextTrimmer 节点在工作流中的应用场景：
- **数据清理**：在数据处理前清理输入文本的格式问题
- **文本预处理**：为 LLM 节点准备干净的输入文本
- **数据标准化**：统一文本格式，去除多余的空白字符
- **用户输入处理**：清理用户输入中的意外空格

这个节点设计简洁明了，专注于文本空格处理，与 TextProcessor 形成良好的功能互补，是 Coze Studio 工作流系统中实用的文本处理工具。

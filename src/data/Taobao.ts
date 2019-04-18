
export interface ICreativeArticleFormItemProps {
  title: string;
  placeholder: string;
  value: any;
  label: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  cutString?: boolean;
  hasLimitHint?: boolean;
  tips?: string;
  plugins?: Array<string|object>;
  dataSource?: Array<ICreativeArticleFormItemDataSource>

  // 图片上传相关
  min: number;
  max: number;
  activityId: number;
  pixFilter: string;
  aspectRatio: string;
  uploadTips: string;
}

export interface ICreativeArticleFormItemDataSource {
  value: string;
  label: string;
  children?: Array<ISelectDataSource>;
  disabled?: boolean;
  labelExtra?: string;
}

export interface ISelectDataSource {
  value: string;
  label: string;
  children: Array<ISelectDataSource>;
}

export interface ICreativeArticleFormData {
  template: "post";
  owner: string;
  formName: string;
  activityName: string;
  source: string;
  userRole: string;
  publishToolbar: string;
  serverData: string;
}

export interface ICreativeArticleFormItem {
  component: "CreatorAddTopic" | "RadioGroup" | "Activity" | "Text" | "Editor" |"CreatorPush" | "DateTime" | "Input" | "Toast" | "InteractContainer" | "Checkbox" | "Forward" | "CreatorAddImage" | "CascaderSelect" | "AddLink" | "CreatorAddTag";
  label: string;
  name: string;
  props: ICreativeArticleFormItemProps;
  rules: Array<ICreativeArticleFormItemRule>
}

export interface ICreativeArticleFormItemRule {
  type: 'string' | 'array';
  message: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface ICreativeArticleData {
  components: ["CreatorAddTopic" | "RadioGroup" | "Activity" | "Text" | "Editor" |"CreatorPush" | "DateTime" | "Input" | "Toast" | "InteractContainer" | "Checkbox" | "Forward" | "CreatorAddImage" | "CascaderSelect" | "AddLink" | "CreatorAddTag"],
  config: {
    actions: Array<object>;
    children: Array<ICreativeArticleFormItem>;
    formData:ICreativeArticleFormData;
    dynamicFormVersion: string;
    labelCol: number;
    name: string;
    updateUrl: string;
  };
  status: string;
}

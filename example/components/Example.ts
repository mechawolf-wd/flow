export const Props = {
  test: {
    type: String,
    default: '',
    required: false
  }
}

export const Template =/* HTML */ `
  <div class="example-container">
    <p class="example-property">{{ example['number-0'] }}</p>
    <p class="example-property">{{ example['number-1'] }}</p>
    <p class="example-property">{{ example['number-2'] }}</p>
    <p class="example-property">{{ example['number-3'] }}</p>
    <p class="example-property">{{ example['number-4'] }}</p>
  </div>
`;

export const Example = () => {
  const example = ref({
    "number-0": Math.trunc(Math.random() * 90 + 10),
    "number-1": Math.trunc(Math.random() * 90 + 10),
    "number-2": Math.trunc(Math.random() * 90 + 10),
    "number-3": Math.trunc(Math.random() * 90 + 10),
    "number-4": Math.trunc(Math.random() * 90 + 10),
    "number-5": Math.trunc(Math.random() * 90 + 10),
    "number-6": Math.trunc(Math.random() * 90 + 10),
    "number-7": Math.trunc(Math.random() * 90 + 10),
  });

  watch(() => $props.test.value, (newValue: string, previousValue: string) => {
    // console.log(newValue, oldValue)
  })

  setInterval(() => {
    example["number-0"] = Math.trunc(Math.random() * 90 + 10);
    example["number-1"] = Math.trunc(Math.random() * 90 + 10);
    example["number-2"] = Math.trunc(Math.random() * 90 + 10);
    example["number-3"] = Math.trunc(Math.random() * 90 + 10);
    example["number-4"] = Math.trunc(Math.random() * 90 + 10);
    example["number-5"] = Math.trunc(Math.random() * 90 + 10);
    example["number-6"] = Math.trunc(Math.random() * 90 + 10);
    example["number-7"] = Math.trunc(Math.random() * 90 + 10);
  }, 1000);

  return {
    example,
  };
};

export const Style = /* CSS */ `
  .example-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, transform 0.3s ease;
    margin-bottom: 8px;
  }

  .example-container:hover {
    background-color: #e0f7fa;
    transform: scale(1.02);
  }

  .example-property {
    margin: 0;
    padding: 8px 12px;
    font-size: 16px;
    color: #333;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .example-property:not(:last-child) {
    margin-right: 16px;
  }

  .example-property:hover {
    background-color: #f0f8ff;
    border-color: #00bcd4;
  }
`;

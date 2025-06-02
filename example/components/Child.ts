export const Child = () => {
  const data = ref(1)

  return {
    data
  }
}

export const Props = {
  example: {
    type: Number,
    default: "",
    required: false
  },
};

export const Template = /* HTML */ `
  <div>
      <p>
        Child: {{ example.value }}
      </p>
  </div>
`

export const Style = ``
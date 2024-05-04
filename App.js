export const App = () => {
  const template = /* HTML */ `
        <div class="exampleClass">
            <Card :card-title-bound="200 + 300"></Card>
        </div>
    `

  return { template }
}
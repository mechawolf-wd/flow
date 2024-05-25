export const App = () => {
  const template = /* HTML */ `
    <Header></Header>
    <div class="exampleClass">
      <Card :card-title-bound="200 + 300">
        <Insert name="message" :if="$path.value === '/new-path'">
          <p>
            Hello from drilled insert.
          </p>
        </Insert>
      </Card>
    </div>
  `;

  return { template };
};

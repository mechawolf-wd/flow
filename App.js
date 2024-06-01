export const Template =/* HTML */ `
  <Header></Header>
  <div class="exampleClass">
    <Card>
      <Insert name="message" :if="$path.value === '/new-path'">
        <p>
          {{ cardTitle.value }}
        </p>
      </Insert>
    </Card>
  </div>
`;

export const App = () => {
  const { cardTitle } = stores.cardStore

  return { cardTitle };
};

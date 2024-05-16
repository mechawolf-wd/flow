export const Header = () => {
  const template = /* HTML */ `
    <h1>Welcome to Flow</h1>
  `;

  const style = /* CSS */ `
    header {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 1rem;
        position: sticky;
        top: 0;
        z-index: 1000;
    }
  `;

  return { template, style };
};

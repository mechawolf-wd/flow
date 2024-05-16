export const Header = () => {
  const template = /* HTML */ `
    <h1>Flow</h1>
  `;

  const style = /* CSS */ `
    header {
      background-color: #333;
      color: #fff;
      text-align: center;
      padding: 1rem;
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `;

  return { template, style };
};

export const Example = () => {
    const template = /* HTML */ ` <h2 class="heading-2">Example content!</h2> `;

    const style = /* CSS */ `
        .heading-2 {
            color: red;
        }
    `;

    return { template, style };
};

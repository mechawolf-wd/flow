export const CurrentDate = () => {
    const template = /* HTML */ `
        <div class="simple-demo-component">
            <Slot name="example"></Slot>
        </div>
    `;

    const style = /* CSS */ `
        .simple-demo-component {
            font-family: 'Arial', sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }
    `;

    return {
        template,
        style
    };
};

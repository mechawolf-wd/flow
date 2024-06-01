export const Template =/* HTML */ `
    <div class="simple-demo-component">
        <Drawer name="example-drawer"></Drawer>
    </div>
`;

export const CurrentDate = () => { };

export const Style = /* CSS */ `
    .simple-demo-component {
        background-color: #f0f0f0;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 8px;
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

export const CurrentDate = ({ ref, useStore }) => {
    const message = ref('Hello, World!');

    const { currentDate } = useStore('dateStore')

    const changeMessage = () => {
        message.value = 'Hello, $FlowEngine!';
    };

    const template = /* HTML */ `
        <div class="simple-demo-component">
            <h3>{{ currentDate }}</h3>
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
        style,
        message,
        currentDate,
        changeMessage
    };
}
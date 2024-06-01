export const Props = {
  cardTitleBound: {
    type: 'string',
    default: "",
    required: false
  },
};

export const Template = /* HTML */ `
  <div class="card">
    <div>
      <h3 class="card-title">{{ cardTitle.value }}</h3>
      <p class="card-description">{{ cardDescription.value }}</p>
    </div>

    <Example></Example>

    <Counter
      :new-counter="cardTitle.value"
      :new-id="cardTitle.value"
      @change-path="changePath('/new-path')"
    >
      <Drawer name="message"></Drawer>
    </Counter>

    <CurrentDate>
      <Insert name="example-drawer">
        <h3>{{ currentDate.value }}</h3>
      </Insert>
    </CurrentDate>

    <TestingReactivity :reactive-prop="cardTitle.value"></TestingReactivity>

    <input
      class="card-input"
      placeholder="Enter title..."
      :model="cardTitle"
      type="text"
    />
  </div>
`;

export const Card = () => {
  const { cardTitle, cardDescription } = $stores.cardStore;
  const { currentDate } = $stores.dateStore;

  const { path } = $router;

  const changePath = (newPath) => {
    path.value = newPath;
  };

  return {
    cardTitle,
    cardDescription,

    currentDate,

    changePath,
  };
};

export const Style = /* CSS */ `
  .card {
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 8px;
  }

  .card:hover {
      transform: translateY(-0.5rem);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .card-title {
      color: #333333;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
  }

  .card-description {
      color: #666666;
      font-size: 1rem;
      line-height: 1.5;
  }

  .card-input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid #cccccc;
      margin-top: 1rem;
      background: #f9f9f9;
      color: #333333;
      box-sizing: border-box;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .card-input:focus {
      border-color: #42b983;
      box-shadow: 0 0 5px rgba(66, 185, 131, 0.5);
      outline: none;
  }
`;

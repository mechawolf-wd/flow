export const props = ["card-title-bound"];

export const template = /* HTML */ `
  <div class="card">
    <Example></Example>

    <div>
      <h3 class="card-title">{{ cardTitle.value }}</h3>
      <p class="card-description">{{ cardDescription.value }}</p>
    </div>

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

    <input
      class="card-input"
      placeholder="Enter title..."
      :value="cardTitle.value"
      @input="onInput"
      type="text"
    />
  </div>
`;

export const Card = () => {
  const { cardTitle, cardDescription } = useStore("cardStore");
  const { currentDate } = useStore("dateStore");

  const onInput = (event) => {
    cardTitle.value = event.target.value;
  };

  const { path } = useRouter();

  const changePath = (newPath) => {
    path.value = newPath;
  };

  return {
    cardTitle,
    cardDescription,

    currentDate,

    onInput,
    changePath,
  };
};

export const style = /* CSS */ `
  .card {
      font-family: 'Arial', sans-serif;
      background: #ffffff; /* White background */
      border: 1px solid #ccc; /* Light grey border */
      border-radius: 0.25rem; /* Rounded corners similar to Bootstrap */
      padding: 1rem; /* Consistent padding around the content */
      margin-bottom: 0.5rem; /* Space between cards */
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Subtle shadow */
      overflow: hidden; /* Prevents any child elements from overflowing */
      padding: 20px 16px;
      margin: 16px;
      display: grid;
      gap: 16px;
  }

  .card-title {
      color: #343a40; /* Dark grey, similar to Bootstrap's default text */
      margin-bottom: 0.5rem; /* Space below the title */
  }

  .card-description {
      color: #6c757d; /* Bootstrap's secondary text color */
      font-size: 1rem; /* Standard font size */
  }
  
  .card-input {
      width: 100%;
      padding: 0.375rem 0.75rem; /* Bootstrap-like padding */
      border-radius: 0.25rem; /* Rounded borders */
      border: 1px solid #ced4da; /* Standard Bootstrap input border */
      margin-top: 1rem; /* Margin above the input */
      background: #f8f9fa; /* Light background for input */
      color: #4950s57; /* Slightly dark grey for text */
      box-sizing: border-box; /* Includes padding and border in the element's total width and height */
  }
`;

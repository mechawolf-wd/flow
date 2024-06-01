export const Template = /* HTML */ `
  <div class="tabs">
    <div class="tabs-header">
      <Loop :for="button in buttons.value">
        <button class="tab-btn" @click="changeTab(button.value)">
          {{ button.text }}
        </button>
      </Loop>
    </div>

    <div class="tabs-content">
      <div :if="currentTab.value === 1">
        <p>Content for Tab 1</p>
      </div>

      <div :if="currentTab.value === 2">
        <p>Content for Tab 2</p>
      </div>

      <div :if="currentTab.value === 3">
        <p>Content for Tab 3</p>
      </div>
    </div>
  </div>
`;

export const Tabs = () => {
  const buttons = ref([
    {
      text: 'Tab 1',
      value: 1
    },
    {
      text: 'Tab 2',
      value: 2
    },
    {
      text: 'Tab 3',
      value: 3
    }
  ]);

  setTimeout(() => {
    buttons.value = [...buttons.value, { text: 'Tab 4', value: 4 }]
  }, 2000);

  const currentTab = ref(1);

  const changeTab = (tab) => {
    currentTab.value = tab;
  };

  return { buttons, currentTab, changeTab };
};

export const Style = /* CSS */ `
    .colored {
        color: red;
    }

    .tabs {
        background: #f8f9fa; /* Light background */
        color: #343a40; /* Default text color */
        border: 1px solid #dee2e6; /* Light grey border */
        border-radius: 0.25rem; /* Rounded corners */
        padding: 1rem; /* Consistent padding all around */
        margin-bottom: 0.5rem; /* Margin to separate from other elements */
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075); /* Soft shadow */
        display: grid;
        gap: 8px;
        transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */
    }

    .tabs:hover {
        transform: translateY(-0.25rem); /* Slight lift on hover */
        box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1); /* Enhanced shadow on hover */
    }

    .tabs-header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 1rem; /* Margin to separate from content */
    }

    .tab-btn {
        background-color: #42b983; /* Vue.js green */
        color: white;
        border: none;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
                    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Smooth transition for hover effects */
    }

    .tab-btn:hover {
        background-color: #2e8b57; /* Darker green on hover */
    }

    .tabs-content {
        padding: 1rem 0;
    }

    .tabs-content > div {
        display: none;
    }

    .tabs-content > div:if([currentTab.value === 1]) {
        display: block;
    }
    
    .tabs-content > div:if([currentTab.value === 2]) {
        display: block;
    }
    
    .tabs-content > div:if([currentTab.value === 3]) {
        display: block;
    }
`;

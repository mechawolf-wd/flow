const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'flow-loading-overlay';
loadingOverlay.innerHTML = `
  <div class="flow-loading-overlay__blue-box"></div>
`;

const style = document.createElement('style');
style.innerText = /*css*/ `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .flow-loading-overlay {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.95);
  }
  
  .flow-loading-overlay__blue-box {
    width: 128px;
    height: 128px;
    background-color: dodgerblue;
    border-radius: 50%;
    animation: pulse 3s infinite ease-in-out;
    filter: blur(50px);
    box-shadow: 0 0 30px #00F0FF, 0 0 60px #00F0FF inset;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(0.85);
      opacity: 0.1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.5;
    }
  }
`;

document.body.append(style);
document.body.append(loadingOverlay);
loadingOverlay.style.display = 'none';

export const showLoadingOverlay = (show) => {
  loadingOverlay.style.display = show ? 'flex' : 'none';
};

export type LogMessage = {
  type: 'log' | 'error' | 'warn';
  content: string;
};

export const executeCode = (code: string): Promise<LogMessage[]> => {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    
    // The "allow-scripts" sandbox without "allow-same-origin" enforces a unique origin.
    // This prevents the executed code from accessing parent window, DOM, localStorage, cookies, etc.
    iframe.setAttribute('sandbox', 'allow-scripts');
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <script>
            window.addEventListener('message', (event) => {
              const code = event.data;
              const logs = [];
              
              const capture = (type) => (...args) => {
                logs.push({ 
                  type, 
                  content: args.map(a => {
                    try {
                      return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a);
                    } catch (e) {
                      return String(a); // Fallback for circular structures
                    }
                  }).join(' ') 
                });
              };
              
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;

              console.log = capture('log');
              console.error = capture('error');
              console.warn = capture('warn');
              
              try {
                // Execute code securely in this sandboxed environment
                eval(code);
              } catch (error) {
                logs.push({ type: 'error', content: error.toString() });
              }
              
              // Wait slightly to capture any immediately resolving microtasks
              setTimeout(() => {
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
                event.source.postMessage(logs, '*');
              }, 10);
            });
          </script>
        </head>
        <body></body>
      </html>
    `;
    
    iframe.srcdoc = html;
    document.body.appendChild(iframe);
    
    let isResolved = false;

    const messageHandler = (event: MessageEvent) => {
      if (event.source === iframe.contentWindow) {
        window.removeEventListener('message', messageHandler);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        isResolved = true;
        resolve(event.data);
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    iframe.onload = () => {
      iframe.contentWindow?.postMessage(code, '*');
    };

    // 5-second timeout in case of infinite loops or hanging code
    setTimeout(() => {
      if (!isResolved) {
        window.removeEventListener('message', messageHandler);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        resolve([{ type: 'error', content: 'Execution timed out after 5 seconds.' }]);
      }
    }, 5000);
  });
};

export type LogMessage = {
  type: 'log' | 'error' | 'warn';
  content: string;
};

export const executeCode = (code: string): Promise<LogMessage[]> => {
  return new Promise((resolve) => {
    const logs: LogMessage[] = [];
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeWindow = iframe.contentWindow as any;
    
    if (!iframeWindow) {
      resolve([{ type: 'error', content: 'Could not create sandbox' }]);
      document.body.removeChild(iframe);
      return;
    }

    iframeWindow.console.log = (...args: any[]) => {
      logs.push({ type: 'log', content: args.map(a => 
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' ') });
    };

    iframeWindow.console.error = (...args: any[]) => {
      logs.push({ type: 'error', content: args.map(a => 
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' ') });
    };

    iframeWindow.console.warn = (...args: any[]) => {
      logs.push({ type: 'warn', content: args.map(a => 
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' ') });
    };

    try {
      iframeWindow.eval(code);
    } catch (error: any) {
      logs.push({ type: 'error', content: error.toString() });
    }

    setTimeout(() => {
      document.body.removeChild(iframe);
      resolve(logs);
    }, 10);
  });
};

import { Flex, TabPanel } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';

interface CodeEditorTabProps {
  code: string;
  setCode: (code: string) => void;
}

export default function CodeEditorTab({ code, setCode }: CodeEditorTabProps) {
  return (
    <TabPanel>
      <Flex flexDirection={'column'} gap={'20px'}>
        <Editor
          value={code}
          language="html"
          theme="vs-dark"
          options={{
            inlineSuggest: true,
            fontSize: '16px',
            formatOnType: true,
            autoClosingBrackets: true,
            minimap: { scale: 10 },
          }}
          height="75vh"
          onChange={(value) => setCode(value || '')}
        />
      </Flex>
    </TabPanel>
  );
}

/**
 *           style={{
            backgroundColor: '#000',
            borderRadius: '10px',
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 18,
            height: '75vh',
            outline: 'none',
            border: 'none',
          }}
 */

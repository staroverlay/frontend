import { Flex, TabPanel } from '@chakra-ui/react';
import a, { highlight, languages } from 'prismjs';
import Editor from 'react-simple-code-editor';

import 'prismjs/themes/prism.css';

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
          onValueChange={setCode}
          highlight={(code) =>
            highlight(
              code,
              {
                ...languages.extend('html', {
                  script: {
                    pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/g,
                    inside: {
                      tag: {
                        pattern: /<script[\w\W]*?>|<\/script>/g,
                      },
                      rest: languages.extend('javascript', {
                        operator: {
                          pattern:
                            /==================================================/g,
                          alias: 'punctuation',
                        },
                      }),
                    },

                    alias: 'language-javascript',
                  },
                }),
              },
              'html',
            )
          }
          padding={10}
          tabSize={2}
          insertSpaces={true}
          style={{
            backgroundColor: '#000',
            borderRadius: '10px',
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 18,
            height: '65vh',
            overflowY: 'auto',
            outline: 'none',
            border: 'none',
          }}
        />
      </Flex>
    </TabPanel>
  );
}

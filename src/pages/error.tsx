import Button from '@/shared/components/Button';
import Container from '@/shared/components/Container';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Container>
        <div className="text-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-5 items-center justify-between">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                404
              </h1>
              <p className="text-gray-400 mt-1">
                The page you are looking for does not exist
              </p>

              <Button
                onClick={() => {
                  navigate(-1);
                }}
                leftIcon={<ArrowLeft className="h-5 w-5" />}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

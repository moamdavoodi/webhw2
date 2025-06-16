import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Types
interface Shape {
  id: string;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
}

// Toast notification component
const Toast = styled.div<{ visible: boolean }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  opacity: ${props => props.visible ? '1' : '0'};
  transition: opacity 0.3s;
  z-index: 1000;
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  flex-shrink: 0;
`;

const TitleInput = styled.input`
  font-size: 18px;
  padding: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin-left: 10px;
  cursor: pointer;
`;

const MainContent = styled.div`
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0; // Important for proper flex behavior
`;

const CanvasContainer = styled.div`
  flex: 1;
  border: 1px solid #ccc;
  overflow: auto;
  position: relative;
  min-height: 0; // Important for proper flex behavior
  
  /* Customizing scrollbar */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
    border: 3px solid #f1f1f1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Canvas = styled.div`
  width: 2000px;
  height: 800px; // Reduced height
  position: relative;
  background: white;
  background-image: 
    linear-gradient(to right, #f0f0f0 1px, transparent 1px),
    linear-gradient(to bottom, #f0f0f0 1px, transparent 1px);
  background-size: 20px 20px;
`;

const Toolbar = styled.div`
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;

  h3 {
    text-align: center;
    margin: 0 0 10px 0;
  }
`;

const ShapeCounter = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border: 1px solid #ccc;
  flex-shrink: 0;
`;

const ToolShape = styled.div`
  width: 50px;
  height: 50px;
  margin: 10px auto;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const CircleShape = styled(ToolShape)`
  border-radius: 50%;
  border: 2px solid black;
`;

const SquareShape = styled(ToolShape)`
  border: 2px solid black;
`;

const TriangleShape = styled(ToolShape)`
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid transparent;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: -23px;
    border-left: 23px solid transparent;
    border-right: 23px solid transparent;
    border-bottom: 46px solid white;
  }
  &::before {
    content: '';
    position: absolute;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 50px solid black;
    top: 0;
    left: -25px;
  }
`;

const CounterShape = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
`;

const CounterCircle = styled(CounterShape)`
  border: 2px solid black;
  border-radius: 50%;
`;

const CounterSquare = styled(CounterShape)`
  border: 2px solid black;
`;

const CounterTriangle = styled(CounterShape)`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid transparent;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 1px;
    left: -9px;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 18px solid white;
  }
  &::before {
    content: '';
    position: absolute;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 20px solid black;
    top: 0;
    left: -10px;
  }
`;

const CounterItem = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
`;

// Add these new styled components after the other styled components
const Dialog = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 1000;
`;

const DialogOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.visible ? 'block' : 'none'};
  z-index: 999;
`;

const DialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const DialogButton = styled(Button)`
  margin: 0;
`;

const CanvasTriangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 50px solid transparent;
  cursor: pointer;
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: -23px;
    border-left: 23px solid transparent;
    border-right: 23px solid transparent;
    border-bottom: 46px solid white;
  }
  &::before {
    content: '';
    position: absolute;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 50px solid black;
    top: 0;
    left: -25px;
  }
`;

function App() {
  const [title, setTitle] = useState('Untitled Painting');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<Shape['type'] | null>(null);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [dialogVisible, setDialogVisible] = useState(false);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  };

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.tool-shape')) {
        setSelectedTool(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleDragStart = (e: React.DragEvent, shapeType: Shape['type']) => {
    e.dataTransfer.setData('shapeType', shapeType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const shapeType = e.dataTransfer.getData('shapeType') as Shape['type'];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newShape: Shape = {
      id: Date.now().toString(),
      type: shapeType,
      x,
      y,
    };

    setShapes([...shapes, newShape]);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newShape: Shape = {
      id: Date.now().toString(),
      type: selectedTool,
      x,
      y,
    };

    setShapes([...shapes, newShape]);
  };

  const handleShapeDoubleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setShapes(shapes.filter(shape => shape.id !== id));
  };

  const handleExport = () => {
    const data = {
      title,
      shapes,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Drawing exported successfully!');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.title || !Array.isArray(data.shapes)) {
        throw new Error('Invalid file format: Missing title or shapes array');
      }

      const validShapes = data.shapes.every((shape: any) => 
        shape.id &&
        ['circle', 'square', 'triangle'].includes(shape.type) &&
        typeof shape.x === 'number' &&
        typeof shape.y === 'number'
      );

      if (!validShapes) {
        throw new Error('Invalid file format: Invalid shape data');
      }

      setTitle(data.title);
      setShapes(data.shapes);
      showToast('Drawing imported successfully!');
    } catch (error) {
      console.error('Error importing file:', error);
      showToast(error instanceof Error ? error.message : 'Invalid file format');
    }
    e.target.value = '';
  };

  const handleClearCanvas = () => {
    if (shapes.length > 0) {
      setDialogVisible(true);
    }
  };

  const confirmClearCanvas = () => {
    setShapes([]);
    setDialogVisible(false);
    showToast('Canvas cleared successfully!');
  };

  const shapeCounts = shapes.reduce(
    (acc, shape) => {
      acc[shape.type]++;
      return acc;
    },
    { circle: 0, square: 0, triangle: 0 }
  );

  return (
    <Container>
      <Header>
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            id="import-input"
            onChange={handleImport}
          />
          <Button onClick={() => document.getElementById('import-input')?.click()}>
            Import
          </Button>
          <Button onClick={handleExport}>Export</Button>
          <Button 
            onClick={handleClearCanvas}
            style={{ backgroundColor: '#ff6b6b' }}
          >
            Clear Canvas
          </Button>
        </div>
      </Header>

      <MainContent>
        <CanvasContainer>
          <Canvas 
            onClick={handleCanvasClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {shapes.map((shape) => (
              <ShapeComponent
                key={shape.id}
                shape={shape}
                onDoubleClick={(e) => handleShapeDoubleClick(e, shape.id)}
              />
            ))}
          </Canvas>
        </CanvasContainer>
        
        <Toolbar>
          <h3>Tools</h3>
          <div className="tool-shape">
            <CircleShape
              draggable
              onDragStart={(e) => handleDragStart(e, 'circle')}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTool('circle');
              }}
              style={{ backgroundColor: selectedTool === 'circle' ? '#ddd' : 'white' }}
            />
          </div>
          <div className="tool-shape">
            <SquareShape
              draggable
              onDragStart={(e) => handleDragStart(e, 'square')}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTool('square');
              }}
              style={{ backgroundColor: selectedTool === 'square' ? '#ddd' : 'white' }}
            />
          </div>
          <div className="tool-shape">
            <TriangleShape
              draggable
              onDragStart={(e) => handleDragStart(e, 'triangle')}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTool('triangle');
              }}
              style={{ 
                borderBottomColor: selectedTool === 'triangle' ? '#666' : 'black' 
              }}
            />
          </div>
        </Toolbar>
      </MainContent>

      <ShapeCounter>
        <CounterItem>
          <CounterCircle /> {shapeCounts.circle}
        </CounterItem>
        <CounterItem>
          <CounterSquare /> {shapeCounts.square}
        </CounterItem>
        <CounterItem>
          <CounterTriangle /> {shapeCounts.triangle}
        </CounterItem>
      </ShapeCounter>

      <Toast visible={toast.visible}>
        {toast.message}
      </Toast>

      <DialogOverlay visible={dialogVisible} onClick={() => setDialogVisible(false)} />
      <Dialog visible={dialogVisible}>
        <h3>Clear Canvas</h3>
        <p>Are you sure you want to clear the canvas? This action cannot be undone.</p>
        <DialogButtons>
          <DialogButton onClick={() => setDialogVisible(false)}>
            Cancel
          </DialogButton>
          <DialogButton 
            onClick={confirmClearCanvas}
            style={{ backgroundColor: '#ff6b6b' }}
          >
            Clear
          </DialogButton>
        </DialogButtons>
      </Dialog>
    </Container>
  );
}

// Shape Component
const ShapeComponent: React.FC<{
  shape: Shape;
  onDoubleClick: (e: React.MouseEvent) => void;
}> = ({ shape, onDoubleClick }) => {
  const ShapeStyle = styled.div`
    position: absolute;
    left: ${shape.x - 25}px;
    top: ${shape.y - 25}px;
    width: 50px;
    height: 50px;
    cursor: pointer;
  `;

  switch (shape.type) {
    case 'circle':
      return (
        <ShapeStyle
          onDoubleClick={(e) => onDoubleClick(e)}
          style={{
            borderRadius: '50%',
            border: '2px solid black',
          }}
        />
      );
    case 'square':
      return (
        <ShapeStyle
          onDoubleClick={(e) => onDoubleClick(e)}
          style={{
            border: '2px solid black',
          }}
        />
      );
    case 'triangle':
      return (
        <CanvasTriangle
          onDoubleClick={(e) => onDoubleClick(e)}
          style={{
            left: `${shape.x - 25}px`,
            top: `${shape.y - 25}px`,
          }}
        />
      );
  }
};

export default App;

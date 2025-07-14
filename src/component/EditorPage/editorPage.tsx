import React, { useCallback, useState } from 'react';
import './editorPage.scss';
import '@xyflow/react/dist/style.css';
import { addEdge, Edge, applyEdgeChanges, Node, applyNodeChanges, ReactFlow } from '@xyflow/react';

const randomColors = [
    'rgba(211, 171, 171, 0.84)',
    'rgba(173, 190, 237, 0.82)',
    'rgba(200, 230, 200, 0.81)',
    'rgba(255, 220, 200, 0.81)',
    'rgba(230, 200, 255, 0.87)',
    'rgba(250, 245, 200, 0.83)',
    'rgba(220, 220, 255, 0.81)',
    'rgba(240, 200, 200, 0.81)',
    'rgba(210, 245, 210, 0.81)',
    'rgba(255, 240, 220, 0.81)',
]
const initialNodes = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Text Messsage 1' }, style: { backgroundColor: randomColors[Math.floor(Math.random() * 10)], color: 'black' }, },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Text Messsage 2' }, style: { backgroundColor: randomColors[Math.floor(Math.random() * 10)], color: 'black' }, },
];

const EditorPage: React.FC = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([{
        id: 'n1-n2', source: 'n1', target: 'n2', animated: true, style: { stroke: 'rgb(202 131 222)' }
    }])
    const [activeNode, setActiveNode] = useState<Node | null>(null);

    const onNodesChange = useCallback(
        (changes: any) => {
            setNodes((nodesSnapshot) => {
                const updatedNodes = applyNodeChanges(changes, nodesSnapshot);
                return updatedNodes;
            });
        },
        []
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: any) => setEdges((edgesSnapshot) => addEdge({
            ...params,
            animated: true,
            style: { stroke: 'rgb(202 131 222)' }
        }, edgesSnapshot)),
        [],
    );

    const saveChange = () => {
        if (inputValue) {
            setNodes((nodes) =>
                nodes.map((node) =>
                    node.id === activeNode?.id ? { ...node, data: { ...node.data, label: inputValue, }, } : node
                )
            );
        }
    }

    const createNode = () => {
        let length = nodes.length + 1
        let newNode = {
            id: `n${length}`, position: { x: 50, y: 50 }, data: { label: `Text Messsage ${length}` }, style: { backgroundColor: randomColors[Math.floor(Math.random() * 10)], color: 'black' }
        }
        setNodes((nodes) => [...nodes, newNode]);
    }

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <article className='editorPage'>
            <section className='navbar d-flex justify-content-between align-items-center px-3 mt-3'>
                <div></div>
                <h4>CHATBOT FLOW BUILDER</h4>
                <button className='mx-3 px-4 py-1 saveButton' onClick={saveChange}>save</button>
            </section>
            <section className='editorParent d-flex'>
                <div className='editor w-100 h-100'>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onSelectionChange={({ nodes }) => {
                            const selected = nodes[0] || null;
                            setActiveNode(selected);
                        }}
                        fitView

                    />
                </div>
                <div className='sidePanel d-flex justify-content-center '>
                    {activeNode ? (
                        <div className='inputField'>
                            <input className='form form-control focus-ring mt-3 d-flex justify-content-center align-items-center' placeholder={String(activeNode?.data?.label || '')} onChange={handleInputChange}></input>
                        </div>
                    ) : (
                        <div className='textBox mt-3 d-flex justify-content-center align-items-center' onClick={createNode}>
                            <h6>Message</h6>
                        </div>
                    )}
                </div>
            </section>
        </article >
    );
};

export default EditorPage;
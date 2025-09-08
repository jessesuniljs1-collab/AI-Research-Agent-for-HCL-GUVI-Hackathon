// HYPERION - AI Research Intelligence Platform
// Clean Professional Light Theme Version - NO THEME TOGGLE

class HyperionApp {
    constructor() {
        this.currentView = 'canvas';
        this.zoomLevel = 1;
        this.canvasOffset = { x: 0, y: 0 };
        this.isDragging = false;
        this.draggedNode = null;
        this.selectedNode = null;
        this.liveCursors = new Map();
        this.isMobile = window.innerWidth <= 1024;
        this.collaborators = [
            { name: 'Dr. Sarah Chen', color: '#0EA5E9', avatar: 'SC' },
            { name: 'Prof. Marcus Johnson', color: '#10B981', avatar: 'MJ' },
            { name: 'Alex Thompson', color: '#F59E0B', avatar: 'AT' }
        ];
        
        // Research data from provided JSON
        this.researchData = {
            "research_project": {
                "title": "Climate Change Policy Impact Analysis 2025",
                "description": "Comprehensive multi-modal research on global climate policies and their effectiveness",
                "team_members": [
                    {"name": "Dr. Sarah Chen", "role": "Lead Researcher", "avatar": "SC", "status": "online"},
                    {"name": "Prof. Marcus Johnson", "role": "Policy Analyst", "avatar": "MJ", "status": "online"},
                    {"name": "Dr. Priya Sharma", "role": "Data Scientist", "avatar": "PS", "status": "away"},
                    {"name": "Alex Thompson", "role": "Research Assistant", "avatar": "AT", "status": "online"}
                ]
            },
            "research_nodes": [
                {
                    "id": "node1",
                    "type": "article",
                    "title": "Paris Agreement Implementation Report 2024",
                    "summary": "Comprehensive analysis showing 67% of signatory countries meeting emission reduction targets",
                    "source": "Nature Climate Change",
                    "credibility": 95,
                    "bias_score": "low",
                    "position": {"x": 280, "y": 180},
                    "connections": ["node2", "node4"]
                },
                {
                    "id": "node2", 
                    "type": "data",
                    "title": "Global Temperature Anomalies Dataset",
                    "summary": "NOAA temperature data showing 1.2°C average increase since pre-industrial times",
                    "source": "NOAA Climate.gov",
                    "credibility": 98,
                    "bias_score": "low",
                    "position": {"x": 480, "y": 220},
                    "connections": ["node1", "node3"]
                },
                {
                    "id": "node3",
                    "type": "image",
                    "title": "Arctic Ice Loss Visualization",
                    "summary": "Satellite imagery showing 13% decline in Arctic sea ice per decade",
                    "source": "NASA Earth Observatory",
                    "credibility": 97,
                    "bias_score": "low", 
                    "position": {"x": 350, "y": 380},
                    "connections": ["node2", "node5"]
                },
                {
                    "id": "node4",
                    "type": "video",
                    "title": "COP28 Policy Discussions",
                    "summary": "Key debates on fossil fuel transition and developing nation support",
                    "source": "Climate Action Network",
                    "credibility": 78,
                    "bias_score": "medium",
                    "position": {"x": 200, "y": 340},
                    "connections": ["node1", "node6"]
                },
                {
                    "id": "node5",
                    "type": "insight",
                    "title": "Economic Impact Correlation",
                    "summary": "AI-identified strong correlation between carbon pricing and emission reductions",
                    "source": "HYPERION AI Analysis",
                    "credibility": 85,
                    "bias_score": "low",
                    "position": {"x": 550, "y": 340},
                    "connections": ["node3", "node6"]
                },
                {
                    "id": "node6",
                    "type": "question",
                    "title": "Policy Effectiveness Gap",
                    "summary": "Research gap: Limited data on policy effectiveness in developing nations",
                    "source": "Team Analysis",
                    "credibility": 75,
                    "bias_score": "medium",
                    "position": {"x": 380, "y": 480},
                    "connections": ["node4", "node5"]
                }
            ],
            "ai_insights": [
                "Strong correlation found between carbon pricing policies and emission reductions (r=0.78)",
                "Geographic bias detected: 73% of studies focus on developed nations",
                "Research gap identified: Limited long-term impact studies beyond 5 years",
                "Conflicting perspectives on nuclear energy role in transition policies"
            ],
            "bias_analysis": {
                "geographic_bias": {
                    "developed_nations": 73,
                    "developing_nations": 27
                },
                "funding_bias": {
                    "government": 45,
                    "private": 35,
                    "ngo": 20
                },
                "temporal_bias": {
                    "recent_5_years": 68,
                    "older_studies": 32
                }
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileInterface();
        this.renderResearchNodes();
        this.drawConnections();
        this.startLiveCollaboration();
        this.initializeBiasCharts();
        this.setupChatInterface();
        this.updateZoomDisplay();
        this.handleResize();
    }

    setupMobileInterface() {
        // Create mobile chat button if it doesn't exist
        if (!document.getElementById('mobileChatToggle')) {
            const mobileChatBtn = document.createElement('button');
            mobileChatBtn.id = 'mobileChatToggle';
            mobileChatBtn.className = 'mobile-chat-toggle';
            mobileChatBtn.innerHTML = '💬';
            mobileChatBtn.addEventListener('click', this.toggleMobileChat.bind(this));
            document.body.appendChild(mobileChatBtn);
        }

        // Create mobile chat overlay if it doesn't exist
        if (!document.getElementById('mobileChatOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'mobileChatOverlay';
            overlay.className = 'mobile-chat-overlay';
            overlay.innerHTML = `
                <div class="mobile-chat-container">
                    <div class="mobile-chat-header">
                        <h3>AI Research Assistant</h3>
                        <button class="mobile-chat-close">×</button>
                    </div>
                    <div class="chat-interface">
                        <div class="chat-messages" id="mobileChatMessages">
                            <div class="chat-message chat-message--ai">
                                <div class="chat-message__avatar">🤖</div>
                                <div class="chat-message__content">
                                    <p>Hello! I'm your AI research assistant. I can help you analyze your climate change research data and identify patterns, bias, and insights.</p>
                                </div>
                            </div>
                        </div>
                        <div class="chat-input">
                            <input type="text" class="form-control" placeholder="Ask me about your research..." id="mobileChatInput">
                            <button class="btn btn--primary" id="mobileSendBtn">Send</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            // Add mobile chat event listeners
            overlay.querySelector('.mobile-chat-close').addEventListener('click', this.closeMobileChat.bind(this));
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.closeMobileChat();
            });
            overlay.querySelector('#mobileSendBtn').addEventListener('click', this.sendMobileChatMessage.bind(this));
            overlay.querySelector('#mobileChatInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMobileChatMessage();
            });
        }
    }

    toggleMobileChat() {
        const overlay = document.getElementById('mobileChatOverlay');
        if (overlay) {
            overlay.classList.toggle('active');
        }
    }

    closeMobileChat() {
        const overlay = document.getElementById('mobileChatOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    sendMobileChatMessage() {
        const input = document.getElementById('mobileChatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message to mobile chat
        this.addMobileChatMessage(message, 'user');
        input.value = '';
        
        // Also add to desktop chat if it exists
        if (document.getElementById('chatMessages')) {
            this.addChatMessage(message, 'user');
        }
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addMobileChatMessage(response, 'ai');
            if (document.getElementById('chatMessages')) {
                this.addChatMessage(response, 'ai');
            }
        }, 1000);
    }

    addMobileChatMessage(text, sender) {
        const messagesContainer = document.getElementById('mobileChatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message--${sender} fade-in`;
        
        const avatar = sender === 'ai' ? '🤖' : 'YU';
        
        messageDiv.innerHTML = `
            <div class="chat-message__avatar">${avatar}</div>
            <div class="chat-message__content">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getAIResponse(message) {
        const responses = {
            'bias': "I've detected several bias patterns in your research: 73% geographic bias toward developed nations, and temporal bias favoring recent studies. Consider expanding to include more developing nation perspectives.",
            'correlation': "The data shows a strong correlation (r=0.78) between carbon pricing policies and emission reductions. This suggests carbon pricing is an effective policy tool.",
            'gap': "I've identified a significant research gap: limited long-term impact studies beyond 5 years. This could be a priority area for future research.",
            'insights': "Key insights from your research: Strong policy correlation, geographic bias detected, research gaps in long-term studies, and emerging focus on nature-based solutions.",
            'default': "Based on your current research, I can help with bias analysis, policy correlations, research gaps, or generating new insights. What would you like to explore?"
        };

        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('bias')) return responses.bias;
        if (lowerMessage.includes('correlation') || lowerMessage.includes('carbon')) return responses.correlation;
        if (lowerMessage.includes('gap') || lowerMessage.includes('missing')) return responses.gap;
        if (lowerMessage.includes('insight') || lowerMessage.includes('summary')) return responses.insights;
        
        return responses.default;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 1024;
            this.updateMobileInterface();
        });
        this.updateMobileInterface();
    }

    updateMobileInterface() {
        const mobileChatBtn = document.getElementById('mobileChatToggle');
        const rightSidebar = document.querySelector('.sidebar--right');
        
        if (this.isMobile) {
            if (mobileChatBtn) mobileChatBtn.style.display = 'flex';
            if (rightSidebar) rightSidebar.style.display = 'none';
        } else {
            if (mobileChatBtn) mobileChatBtn.style.display = 'none';
            if (rightSidebar) rightSidebar.style.display = 'flex';
        }
    }

    setupEventListeners() {
        // View navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Canvas controls
        document.getElementById('addNodeBtn').addEventListener('click', this.addNewNode.bind(this));
        document.getElementById('exportBtn').addEventListener('click', this.exportAnalysis.bind(this));
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(0.8));

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', this.closeModal.bind(this));
        document.querySelector('.modal__overlay').addEventListener('click', this.closeModal.bind(this));
        document.getElementById('saveNodeBtn').addEventListener('click', this.saveNodeChanges.bind(this));
        document.getElementById('deleteNodeBtn').addEventListener('click', this.deleteNode.bind(this));

        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('drop', this.handleFileDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileUpload.bind(this));

        // Desktop Chat interface
        const sendChatBtn = document.getElementById('sendChatBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendChatBtn && chatInput) {
            sendChatBtn.addEventListener('click', this.sendChatMessage.bind(this));
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendChatMessage();
            });
        }

        // Canvas interactions
        const canvas = document.getElementById('researchCanvas');
        canvas.addEventListener('mousedown', this.handleCanvasMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.handleCanvasMouseUp.bind(this));
        canvas.addEventListener('wheel', this.handleCanvasWheel.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Tool cards functionality
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', this.handleToolCardClick.bind(this));
        });
    }

    handleToolCardClick(e) {
        const toolCard = e.currentTarget;
        const toolText = toolCard.querySelector('span').textContent;
        
        // Add visual feedback
        toolCard.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toolCard.style.transform = '';
        }, 150);
        
        // Handle different tools
        switch(toolText) {
            case 'Bias Analysis':
                this.switchView('bias');
                break;
            case 'Deep Search':
                this.showNotification('Deep Search feature coming soon!');
                break;
            case 'AI Insights':
                this.generateNewInsight();
                break;
            case 'Trend Analysis':
                this.showNotification('Analyzing trends in your research data...');
                break;
        }
    }

    generateNewInsight() {
        const newInsights = [
            "Emerging pattern: Renewable energy policies show 40% higher success rate in coastal regions",
            "Data gap identified: Only 15% of studies include indigenous community perspectives",
            "Trend detected: Carbon tax effectiveness correlates with GDP per capita (r=0.65)",
            "Policy overlap found: 68% of successful climate initiatives combine economic and social measures"
        ];
        
        const insight = newInsights[Math.floor(Math.random() * newInsights.length)];
        this.researchData.ai_insights.push(insight);
        
        // Add to insights display
        const insightsList = document.querySelector('.insights-list');
        if (insightsList) {
            const insightElement = document.createElement('div');
            insightElement.className = 'insight-item fade-in';
            insightElement.innerHTML = `
                <div class="insight-item__icon">✨</div>
                <div class="insight-item__content">
                    <p>${insight}</p>
                </div>
            `;
            insightsList.appendChild(insightElement);
        }
        
        this.showNotification('New AI insight generated!');
    }

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('nav-tab--active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('nav-tab--active');

        // Update view containers
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.remove('view-container--active');
        });
        document.getElementById(`${viewName}View`).classList.add('view-container--active');

        this.currentView = viewName;

        // Initialize view-specific content
        if (viewName === 'graph') {
            this.renderKnowledgeGraph();
        } else if (viewName === 'bias') {
            this.updateBiasCharts();
        }
    }

    renderResearchNodes() {
        const nodesLayer = document.getElementById('nodesLayer');
        if (!nodesLayer) return;
        
        nodesLayer.innerHTML = '';

        this.researchData.research_nodes.forEach(node => {
            const nodeElement = this.createNodeElement(node);
            nodesLayer.appendChild(nodeElement);
        });
    }

    createNodeElement(node) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = `research-node research-node--${node.type}`;
        nodeDiv.dataset.nodeId = node.id;
        nodeDiv.style.left = `${node.position.x}px`;
        nodeDiv.style.top = `${node.position.y}px`;

        const nodeIcons = {
            article: '📄',
            data: '📊',
            image: '🖼️',
            video: '🎥',
            insight: '💡',
            question: '❓'
        };

        nodeDiv.innerHTML = `
            <div class="node-header">
                <div class="node-icon">${nodeIcons[node.type]}</div>
                <h4 class="node-title">${node.title}</h4>
            </div>
            <p class="node-summary">${node.summary}</p>
            <div class="node-footer">
                <span class="node-source">${node.source}</span>
                <div class="node-badges">
                    <span class="credibility-badge">${node.credibility}%</span>
                    <span class="bias-badge bias-badge--${node.bias_score}">${node.bias_score}</span>
                </div>
            </div>
        `;

        // Add event listeners - NO TEAM MEMBER NAMES ON CANVAS
        nodeDiv.addEventListener('click', () => this.selectNode(node.id));
        nodeDiv.addEventListener('dblclick', () => this.editNode(node.id));
        nodeDiv.addEventListener('mousedown', (e) => this.startDragNode(e, node.id));

        return nodeDiv;
    }

    drawConnections() {
        const svg = document.getElementById('connectionsLayer');
        if (!svg) return;
        
        svg.innerHTML = '';

        this.researchData.research_nodes.forEach(node => {
            node.connections.forEach(targetId => {
                const targetNode = this.researchData.research_nodes.find(n => n.id === targetId);
                if (targetNode) {
                    this.drawConnection(svg, node.position, targetNode.position);
                }
            });
        });
    }

    drawConnection(svg, start, end) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'connection-line');
        line.setAttribute('x1', start.x);
        line.setAttribute('y1', start.y);
        line.setAttribute('x2', end.x);
        line.setAttribute('y2', end.y);
        svg.appendChild(line);
    }

    selectNode(nodeId) {
        // Remove previous selection
        document.querySelectorAll('.research-node--selected').forEach(node => {
            node.classList.remove('research-node--selected');
        });

        // Select new node
        const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.classList.add('research-node--selected');
            this.selectedNode = nodeId;
        }
    }

    editNode(nodeId) {
        const node = this.researchData.research_nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Populate modal with node data
        document.getElementById('modalTitle').textContent = 'Edit Research Item';
        document.getElementById('nodeTitle').value = node.title;
        document.getElementById('nodeType').value = node.type;
        document.getElementById('nodeSummary').value = node.summary;
        document.getElementById('nodeSource').value = node.source;
        document.getElementById('credibilityValue').textContent = node.credibility;
        document.getElementById('credibilityFill').style.width = `${node.credibility}%`;
        document.getElementById('biasIndicator').textContent = node.bias_score;
        document.getElementById('biasIndicator').className = `bias-indicator bias-indicator--${node.bias_score}`;

        // Show modal
        document.getElementById('nodeModal').classList.remove('hidden');
        this.selectedNode = nodeId;
    }

    closeModal() {
        document.getElementById('nodeModal').classList.add('hidden');
        this.selectedNode = null;
    }

    saveNodeChanges() {
        if (!this.selectedNode) return;

        const node = this.researchData.research_nodes.find(n => n.id === this.selectedNode);
        if (!node) return;

        // Update node data
        node.title = document.getElementById('nodeTitle').value;
        node.type = document.getElementById('nodeType').value;
        node.summary = document.getElementById('nodeSummary').value;
        node.source = document.getElementById('nodeSource').value;

        // Re-render nodes
        this.renderResearchNodes();
        this.drawConnections();
        this.closeModal();

        // Show success message
        this.showNotification('Research item updated successfully!');
    }

    deleteNode() {
        if (!this.selectedNode) return;

        // Remove node from data
        this.researchData.research_nodes = this.researchData.research_nodes.filter(
            n => n.id !== this.selectedNode
        );

        // Remove connections to this node
        this.researchData.research_nodes.forEach(node => {
            node.connections = node.connections.filter(id => id !== this.selectedNode);
        });

        // Re-render
        this.renderResearchNodes();
        this.drawConnections();
        this.closeModal();

        this.showNotification('Research item deleted successfully!');
    }

    addNewNode() {
        const newNode = {
            id: `node${Date.now()}`,
            type: 'article',
            title: 'New Research Item',
            summary: 'Add your summary here...',
            source: 'Unknown Source',
            credibility: 50,
            bias_score: 'medium',
            position: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
            connections: []
        };

        this.researchData.research_nodes.push(newNode);
        this.renderResearchNodes();
        this.editNode(newNode.id);
    }

    startDragNode(e, nodeId) {
        e.preventDefault();
        this.isDragging = true;
        this.draggedNode = nodeId;
        
        const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (nodeElement) {
            nodeElement.classList.add('dragging');
        }
        
        this.dragOffset = {
            x: e.clientX - nodeElement.offsetLeft,
            y: e.clientY - nodeElement.offsetTop
        };
    }

    handleCanvasMouseDown(e) {
        if (e.target.classList.contains('research-node') || e.target.closest('.research-node')) {
            return; // Let node drag handler take over
        }

        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
    }

    handleCanvasMouseMove(e) {
        if (this.draggedNode) {
            const nodeElement = document.querySelector(`[data-node-id="${this.draggedNode}"]`);
            if (nodeElement) {
                const newX = e.clientX - this.dragOffset.x;
                const newY = e.clientY - this.dragOffset.y;
                
                nodeElement.style.left = `${newX}px`;
                nodeElement.style.top = `${newY}px`;
                
                // Update node data
                const node = this.researchData.research_nodes.find(n => n.id === this.draggedNode);
                if (node) {
                    node.position.x = newX;
                    node.position.y = newY;
                }
                
                this.drawConnections();
            }
        }

        // Simulate live collaboration
        this.updateLiveCursors(e);
    }

    handleCanvasMouseUp(e) {
        if (this.draggedNode) {
            const nodeElement = document.querySelector(`[data-node-id="${this.draggedNode}"]`);
            if (nodeElement) {
                nodeElement.classList.remove('dragging');
            }
            this.draggedNode = null;
        }
        
        this.isDragging = false;
    }

    handleCanvasWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
        this.zoom(zoomFactor);
    }

    zoom(factor) {
        this.zoomLevel = Math.max(0.2, Math.min(3, this.zoomLevel * factor));
        
        const canvas = document.getElementById('researchCanvas');
        if (canvas) {
            canvas.style.transform = `scale(${this.zoomLevel})`;
        }
        
        this.updateZoomDisplay();
    }

    updateZoomDisplay() {
        const zoomElement = document.getElementById('zoomLevel');
        if (zoomElement) {
            zoomElement.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
    }

    startLiveCollaboration() {
        // Simulate live cursors
        setInterval(() => {
            this.collaborators.forEach((collaborator, index) => {
                this.simulateCursorMovement(collaborator, index);
            });
        }, 3000);

        // Simulate activity updates
        setInterval(() => {
            this.addRandomActivity();
        }, 20000);
    }

    simulateCursorMovement(collaborator, index) {
        const canvas = document.getElementById('researchCanvas');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + Math.random() * rect.height;
        
        this.updateCollaboratorCursor(collaborator, x, y);
    }

    updateCollaboratorCursor(collaborator, x, y) {
        const cursorsContainer = document.getElementById('liveCursors');
        if (!cursorsContainer) return;
        
        let cursor = cursorsContainer.querySelector(`[data-user="${collaborator.avatar}"]`);
        
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'live-cursor';
            cursor.dataset.user = collaborator.avatar;
            cursor.dataset.name = collaborator.name;
            cursor.style.borderColor = collaborator.color;
            cursorsContainer.appendChild(cursor);
        }
        
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    }

    updateLiveCursors(e) {
        // Hide live cursors when user is active
        const cursors = document.querySelectorAll('.live-cursor');
        cursors.forEach(cursor => {
            cursor.style.opacity = '0.3';
        });
        
        setTimeout(() => {
            cursors.forEach(cursor => {
                cursor.style.opacity = '1';
            });
        }, 1000);
    }

    addRandomActivity() {
        const activities = [
            'added new research data',
            'updated bias analysis',
            'commented on findings',
            'connected research items',
            'uploaded supporting material',
            'flagged potential bias issue'
        ];
        
        const collaborator = this.collaborators[Math.floor(Math.random() * this.collaborators.length)];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        this.addActivityItem(collaborator.name, activity, 'just now');
    }

    addActivityItem(user, action, time) {
        const activityFeed = document.querySelector('.activity-feed');
        if (!activityFeed) return;
        
        const item = document.createElement('div');
        item.className = 'activity-item fade-in';
        
        const avatar = user.split(' ').map(n => n[0]).join('');
        
        item.innerHTML = `
            <div class="activity-item__avatar">${avatar}</div>
            <div class="activity-item__content">
                <div class="activity-item__text">
                    <strong>${user}</strong> ${action}
                </div>
                <div class="activity-item__time">${time}</div>
            </div>
        `;
        
        activityFeed.insertBefore(item, activityFeed.firstChild);
        
        // Remove old items
        const items = activityFeed.querySelectorAll('.activity-item');
        if (items.length > 5) {
            activityFeed.removeChild(items[items.length - 1]);
        }
    }

    initializeBiasCharts() {
        // Wait for Chart.js to load
        setTimeout(() => {
            this.createBiasCharts();
        }, 500);
    }

    createBiasCharts() {
        // Geographic Bias Chart
        const geoCanvas = document.getElementById('geoChart');
        if (geoCanvas && typeof Chart !== 'undefined') {
            const geoCtx = geoCanvas.getContext('2d');
            new Chart(geoCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Developed Nations', 'Developing Nations'],
                    datasets: [{
                        data: [73, 27],
                        backgroundColor: ['#0EA5E9', '#10B981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        }

        // Funding Sources Chart
        const fundingCanvas = document.getElementById('fundingChart');
        if (fundingCanvas && typeof Chart !== 'undefined') {
            const fundingCtx = fundingCanvas.getContext('2d');
            new Chart(fundingCtx, {
                type: 'bar',
                data: {
                    labels: ['Government', 'Private', 'NGO'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 50,
                            ticks: {
                                font: {
                                    size: 10
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    size: 10
                                }
                            }
                        }
                    }
                }
            });
        }

        // Temporal Distribution Chart
        const temporalCanvas = document.getElementById('temporalChart');
        if (temporalCanvas && typeof Chart !== 'undefined') {
            const temporalCtx = temporalCanvas.getContext('2d');
            new Chart(temporalCtx, {
                type: 'pie',
                data: {
                    labels: ['Recent (5 years)', 'Older Studies'],
                    datasets: [{
                        data: [68, 32],
                        backgroundColor: ['#EF4444', '#8B5CF6'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    updateBiasCharts() {
        // Charts are already initialized, could add dynamic updates here
        console.log('Bias charts updated');
    }

    renderKnowledgeGraph() {
        const graphContainer = document.querySelector('.knowledge-graph');
        if (!graphContainer) return;
        
        const placeholder = graphContainer.querySelector('.graph-placeholder');
        
        if (placeholder) {
            placeholder.textContent = 'Interactive Knowledge Graph - Analyzing connections...';
            
            // Simulate graph loading
            setTimeout(() => {
                placeholder.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #334155;">
                        <div style="font-size: 48px; margin-bottom: 20px;">🕸️</div>
                        <h3 style="color: #1E293B; margin-bottom: 10px;">Knowledge Graph Network</h3>
                        <p style="margin-bottom: 20px;">Interactive visualization of ${this.researchData.research_nodes.length} research items and their connections</p>
                        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                            <div style="padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #10B981; border-radius: 16px; font-size: 12px; font-weight: 500;">
                                ${this.researchData.research_nodes.filter(n => n.bias_score === 'low').length} Low Bias Sources
                            </div>
                            <div style="padding: 6px 12px; background: rgba(245, 158, 11, 0.1); color: #F59E0B; border-radius: 16px; font-size: 12px; font-weight: 500;">
                                ${this.researchData.research_nodes.filter(n => n.bias_score === 'medium').length} Medium Bias Sources
                            </div>
                        </div>
                    </div>
                `;
            }, 1500);
        }
    }

    setupChatInterface() {
        // Add some predefined responses
        this.aiResponses = [
            "I've analyzed your climate policy data and identified key patterns in implementation success rates.",
            "The correlation between carbon pricing and emissions reduction is statistically significant (r=0.78). Would you like me to explore this further?",
            "I've detected geographic bias in your source distribution. Consider adding more perspectives from developing nations.",
            "There's a notable research gap in long-term impact studies beyond 5 years. This could be a priority area.",
            "Your temporal analysis shows heavy weighting toward recent studies. Historical context might strengthen the research."
        ];
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addChatMessage(message, 'user');
        
        // Clear input
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const response = this.getAIResponse(message);
            this.addChatMessage(response, 'ai');
        }, 1000);
    }

    addChatMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message--${sender} fade-in`;
        
        const avatar = sender === 'ai' ? '🤖' : 'YU';
        
        messageDiv.innerHTML = `
            <div class="chat-message__avatar">${avatar}</div>
            <div class="chat-message__content">
                <p>${text}</p>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleFileUpload(e) {
        const files = e.target.files;
        this.processFiles(files);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drop-zone--active');
    }

    handleFileDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drop-zone--active');
        
        const files = e.dataTransfer.files;
        this.processFiles(files);
    }

    processFiles(files) {
        Array.from(files).forEach((file, index) => {
            setTimeout(() => {
                this.simulateFileProcessing(file);
            }, index * 500);
        });
    }

    simulateFileProcessing(file) {
        const fileTypes = {
            'pdf': 'article',
            'jpg': 'image',
            'png': 'image',
            'mp4': 'video',
            'txt': 'article'
        };
        
        const extension = file.name.split('.').pop().toLowerCase();
        const nodeType = fileTypes[extension] || 'article';
        
        // Create new node
        const newNode = {
            id: `node${Date.now()}`,
            type: nodeType,
            title: file.name,
            summary: `Uploaded file: ${file.name} - AI analysis in progress...`,
            source: 'User Upload',
            credibility: Math.floor(Math.random() * 30) + 70,
            bias_score: ['low', 'medium'][Math.floor(Math.random() * 2)],
            position: { 
                x: 200 + Math.random() * 400, 
                y: 150 + Math.random() * 300 
            },
            connections: []
        };
        
        this.researchData.research_nodes.push(newNode);
        this.renderResearchNodes();
        this.drawConnections();
        
        this.showNotification(`File "${file.name}" processed and added to research canvas!`);
        
        // Simulate AI analysis completion
        setTimeout(() => {
            newNode.summary = `AI-analyzed content from ${file.name}. Key insights extracted and bias assessment completed.`;
            this.renderResearchNodes();
        }, 3000);
    }

    exportAnalysis() {
        const analysisData = {
            project: this.researchData.research_project,
            nodes: this.researchData.research_nodes,
            insights: this.researchData.ai_insights,
            bias_analysis: this.researchData.bias_analysis,
            export_date: new Date().toISOString(),
            node_count: this.researchData.research_nodes.length,
            connection_count: this.researchData.research_nodes.reduce((sum, node) => sum + node.connections.length, 0)
        };
        
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hyperion_research_analysis.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Research analysis exported successfully!');
    }

    handleKeydown(e) {
        // Keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    this.addNewNode();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportAnalysis();
                    break;
                case '1':
                    e.preventDefault();
                    this.switchView('canvas');
                    break;
                case '2':
                    e.preventDefault();
                    this.switchView('graph');
                    break;
                case '3':
                    e.preventDefault();
                    this.switchView('bias');
                    break;
                case '4':
                    e.preventDefault();
                    this.switchView('timeline');
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.closeModal();
            this.closeMobileChat();
        }
        
        if (e.key === 'Delete' && this.selectedNode) {
            this.deleteNode();
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification fade-in';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            background: #10B981;
            color: #FFFFFF;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.06);
            z-index: 1001;
            font-size: 14px;
            font-weight: 500;
            transition: all 300ms ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HyperionApp();
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
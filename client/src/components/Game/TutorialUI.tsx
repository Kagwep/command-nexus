import { Scene, Color3 } from "@babylonjs/core";

type ContentItem = {
    gType: 'section' | 'image';
    data: {
        title?: string;
        content?: string;
        url?: string;
    };
};

const COLORS = {
    BRILLIANT_AZURE: new Color3(0.0, 0.7, 1.0),
    POLISHED_SILVER: new Color3(0.8, 0.8, 0.8),
    CRIMSON_RED: new Color3(1.0, 0.0, 0.0),
    BRILLIANT_GOLD: new Color3(1.0, 0.8, 0.0),
    EMERALD_GREEN: new Color3(0.0, 0.8, 0.0)
};

const DEFAULT_MAPPINGS = {
    RadiantShores: 'BRILLIANT_AZURE',
    Ironforge: 'POLISHED_SILVER',
    Skullcrag: 'CRIMSON_RED',
    NovaWarhound: 'BRILLIANT_GOLD',
    SavageCoast: 'EMERALD_GREEN'
};

export class TutorialUI {
    private container: HTMLDivElement;
    private scene: Scene;
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.zIndex = '10';
        this.container.style.pointerEvents = 'none';
        document.body.appendChild(this.container);
    }

    private colorToHex(color: Color3): string {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    public showInfo(content: ContentItem[]): void {
        const htmlContent = document.createElement('div');
        htmlContent.className = 'fixed inset-0 flex items-center justify-center';
        htmlContent.style.pointerEvents = 'auto';
        
        htmlContent.innerHTML = `
            <div class="w-[800px] h-[600px] bg-[#333333F2] rounded-lg flex flex-col">
                <div class="h-[50px] bg-[#444444] rounded-t-lg flex items-center justify-between px-5">
                    <h2 class="text-white text-xl">Guide</h2>
                    <button class="w-10 h-10 bg-[#666666] text-white rounded-lg hover:bg-[#777777] transition-colors">
                        X
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div class="space-y-6">
                        ${this.generateContent(content)}
                    </div>
                </div>
            </div>
        `;
        
        this.container.appendChild(htmlContent);
        
        const closeButton = htmlContent.querySelector('button');
        closeButton?.addEventListener('click', () => {
            this.container.removeChild(htmlContent);
        });

        // Add custom scrollbar styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #333333;
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #666666;
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #777777;
            }
        `;
        document.head.appendChild(style);
    }
    
    private generateContent(content: ContentItem[]): string {
        return content.map(item => {
            switch (item.gType) {
                case 'section':
                    return this.generateSection(item.data);
                case 'image':
                    return this.generateImage(item.data);
                default:
                    return '';
            }
        }).join('');
    }
    
    private generateSection(data: { title?: string; content?: string }): string {
        if (!data.title && !data.content) return '';

        // Special handling for Base Insignias section
        if (data.title === 'Base Insignias') {
            return this.generateBaseInsigniasSection(data.title);
        }

        // Handle content with bullet points
        let formattedContent = data.content || '';
        if (formattedContent.includes('\n\n•')) {
            const [intro, listContent] = formattedContent.split('\n\n');
            const listItems = listContent.split('\n• ').filter(Boolean);
            formattedContent = `
                <p class="text-[#CCCCCC] mb-3">${intro}</p>
                <ul class="space-y-2">
                    ${listItems.map(item => `
                        <li class="text-[#CCCCCC] pl-4 relative">
                            <span class="absolute left-0">•</span>
                            ${item}
                        </li>
                    `).join('')}
                </ul>
            `;
        } else if (formattedContent.includes('\n')) {
            formattedContent = formattedContent.split('\n').map(line => 
                line ? `<p class="text-[#CCCCCC] mb-2">${line}</p>` : ''
            ).join('');
        } else {
            formattedContent = `<p class="text-[#CCCCCC]">${formattedContent}</p>`;
        }

        return `
            <div class="mb-6">
                ${data.title ? `<h3 class="text-green-500 text-xl mb-3">${data.title}</h3>` : ''}
                ${formattedContent}
            </div>
        `;
    }

    private generateBaseInsigniasSection(title: string): string {
        const baseList = Object.entries(DEFAULT_MAPPINGS).map(([base, colorKey]) => {
            const color = COLORS[colorKey];
            const hexColor = this.colorToHex(color);
            return `
                <li class="pl-4 relative flex items-center gap-2 mb-2">
                    <span class="absolute left-0" style="color: ${hexColor}">•</span>
                    <span style="color: ${hexColor}">${base}</span>
                </li>
            `;
        }).join('');

        return `
            <div class="mb-6">
                <h3 class="text-white text-xl mb-3">${title}</h3>
                <p class="text-[#CCCCCC] mb-3">Your troops will be marked with insignias based on your home base:</p>
                <ul class="space-y-1">
                    ${baseList}
                </ul>
            </div>
        `;
    }
    
    private generateImage(data: { url?: string }): string {
        if (!data.url) return '';
        
        return `
            <div class="flex justify-center mb-6">
                <img 
                    src="${data.url}" 
                    class="rounded-lg max-w-full h-auto"
                    alt="Guide Image"
                />
            </div>
        `;
    }
    
    public dispose(): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}
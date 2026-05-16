import React, { useState } from 'react';
import SingleImageUpload from '../common/SingleImageUpload';
import { EDITORIAL_BLOCK_TYPES, EDITORIAL_LAYOUTS } from '../../constants/productConstants';

const EditorialBuilder = ({ content = [], products = [], onChange }) => {
  const [activeTab, setActiveTab] = useState(null);

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      layout: EDITORIAL_LAYOUTS[0].id,
      content: '',
      url: '',
      productId: null
    };
    onChange([...content, newBlock]);
  };

  const updateBlock = (id, updates) => {
    const newContent = content.map(block => 
      block.id === id ? { ...block, ...updates } : block
    );
    onChange(newContent);
  };

  const removeBlock = (id) => {
    onChange(content.filter(block => block.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newContent = [...content];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newContent.length) return;
    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
    onChange(newContent);
  };

  const renderBlockEditor = (block, index) => {
    return (
      <div key={block.id || index} className="relative bg-surface-container-lowest border border-outline-variant/10 p-8 mb-6 group animate-in fade-in slide-in-from-bottom-4">
        {/* Toolbar */}
        <div className="absolute -left-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={() => moveBlock(index, -1)} className="w-8 h-8 bg-surface border border-outline-variant/20 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
          </button>
          <button type="button" onClick={() => moveBlock(index, 1)} className="w-8 h-8 bg-surface border border-outline-variant/20 flex items-center justify-center hover:bg-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_downward</span>
          </button>
          <button type="button" onClick={() => removeBlock(block.id)} className="w-8 h-8 bg-surface border border-outline-variant/20 flex items-center justify-center hover:bg-error hover:text-white transition-colors">
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="font-label text-[9px] uppercase tracking-[0.2em] bg-on-surface/5 px-2 py-1 font-bold">
            Block {index + 1}: {block.type.replace('_', ' ')}
          </span>
          <div className="flex gap-4">
             <select 
               value={block.layout} 
               onChange={(e) => updateBlock(block.id, { layout: e.target.value })}
               className="bg-transparent border-b border-outline-variant/20 font-label text-[9px] uppercase tracking-widest focus:outline-none"
             >
                <option value="full">Full Width</option>
                <option value="half">Half Split</option>
                <option value="sidebar">Editorial Sidebar</option>
             </select>
          </div>
        </div>

        {/* Content Types */}
        {block.type === 'text' && (
          <textarea
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Kể về cảm hứng hoặc chi tiết của bộ sưu tập..."
            className="w-full bg-transparent border-none font-body text-base leading-relaxed focus:outline-none min-h-[100px] italic"
          />
        )}

        {block.type === 'image' && (
          <div className="space-y-4">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Ảnh Lookbook</label>
            <SingleImageUpload 
              imageUrl={block.url}
              onChange={(url) => updateBlock(block.id, { url: url })}
              placeholder="Tải ảnh Lookbook nghệ thuật..."
              aspectRatio="aspect-[4/5]"
            />
          </div>
        )}

        {block.type === 'product_highlight' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Chọn sản phẩm nổi bật</label>
              <select
                value={block.productId || ''}
                onChange={(e) => updateBlock(block.id, { productId: parseInt(e.target.value) })}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 font-body text-sm focus:outline-none"
              >
                <option value="">Chọn sản phẩm từ kho</option>
                {products.map(p => (
                  <option key={p.productId} value={p.productId}>{p.name} - {p.skuBase}</option>
                ))}
              </select>
            </div>
            {block.productId && (
              <div className="bg-surface-container-low p-4 flex items-center gap-4">
                <div className="w-16 h-20 bg-surface-container overflow-hidden">
                   <img 
                    src={products.find(p => p.productId === block.productId)?.productImages?.[0]?.imageUrl || 'https://via.placeholder.com/100x150'} 
                    alt="Product" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <div>
                  <p className="font-headline text-sm">{products.find(p => p.productId === block.productId)?.name}</p>
                  <p className="font-body text-[10px] text-on-surface-variant uppercase">{products.find(p => p.productId === block.productId)?.skuBase}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="editorial-builder space-y-8">
      <div className="border-l-4 border-on-surface pl-6 mb-8">
        <h4 className="font-headline text-xl text-on-surface uppercase tracking-tight">Cấu trúc Câu chuyện (Story Builder)</h4>
        <p className="font-body text-xs text-on-surface-variant opacity-60 italic">Kéo thả hoặc đan xen các khối nội dung để tạo trang Lookbook nghệ thuật</p>
      </div>

      <div className="story-blocks">
        {content && content.length > 0 ? (
          content.map((block, index) => renderBlockEditor(block, index))
        ) : (
          <div className="py-20 border-2 border-dashed border-outline-variant/10 flex flex-col items-center justify-center text-on-surface-variant/40">
             <span className="material-symbols-outlined text-4xl mb-4">auto_awesome_motion</span>
             <p className="font-body text-sm uppercase tracking-widest">Bắt đầu xây dựng câu chuyện của bạn</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 pt-8 border-t border-outline-variant/10 justify-center">
        <button
          type="button"
          onClick={() => addBlock('text')}
          className="flex items-center gap-2 px-6 py-3 border border-outline-variant/30 font-label text-[10px] uppercase tracking-widest hover:bg-on-surface hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-sm">notes</span>
          Thêm Văn bản
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          className="flex items-center gap-2 px-6 py-3 border border-outline-variant/30 font-label text-[10px] uppercase tracking-widest hover:bg-on-surface hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-sm">photo_library</span>
          Thêm Ảnh Lookbook
        </button>
        <button
          type="button"
          onClick={() => addBlock('product_highlight')}
          className="flex items-center gap-2 px-6 py-3 border border-outline-variant/30 font-label text-[10px] uppercase tracking-widest hover:bg-on-surface hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-sm">shopping_bag</span>
          Sản phẩm nổi bật
        </button>
      </div>
    </div>
  );
};

export default EditorialBuilder;

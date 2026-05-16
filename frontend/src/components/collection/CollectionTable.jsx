import React from 'react';

const CollectionRow = ({ collection, onEdit, onDelete }) => {
  const coverImage = collection.coverImageUrl || 'https://via.placeholder.com/300x150?text=No+Cover';

  return (
    <tr className="group hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/5">
      <td className="py-6 px-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-16 bg-surface-container overflow-hidden border border-outline-variant/10 shadow-sm">
            <img 
              src={coverImage} 
              alt={collection.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div>
            <h4 className="font-headline text-base text-on-surface mb-1">{collection.name}</h4>
            <span className="font-body text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{collection.season} {collection.year}</span>
          </div>
        </div>
      </td>
      <td className="py-6 px-8">
        <span className="font-body text-sm text-on-surface">
           {collection.productCount || 0} sản phẩm
        </span>
      </td>
      <td className="py-6 px-8 text-center">
        {collection.isFeatured && (
          <span className="bg-secondary/10 text-secondary text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-widest">Nổi bật</span>
        )}
      </td>
      <td className="py-6 px-8 text-center">
        <span className={`font-label text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold ${
          collection.isActive 
            ? 'bg-success-container text-on-success-container' 
            : 'bg-error-container text-on-error-container'
        }`}>
          {collection.isActive ? 'Hoạt động' : 'Đã ẩn'}
        </span>
      </td>
      <td className="py-6 px-8 text-right">
        <div className="flex justify-end gap-4">
          <button 
            onClick={() => onEdit(collection)}
            className="text-on-surface-variant hover:text-primary transition-colors"
            title="Chỉnh sửa"
          >
            <span className="material-symbols-outlined text-lg">edit_note</span>
          </button>
          <button 
            onClick={() => onDelete(collection.collectionId)}
            className="text-on-surface-variant hover:text-error transition-colors"
            title="Xóa"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const CollectionTable = ({ collections, loading, onEdit, onDelete }) => {
  return (
    <section className="bg-surface-container-lowest overflow-hidden border border-outline-variant/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/10">
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Bộ sưu tập</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Số lượng</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Đặc biệt</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Trạng thái</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">Đang tải bộ sưu tập...</p>
                </td>
              </tr>
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">
                  Không tìm thấy bộ sưu tập nào.
                </td>
              </tr>
            ) : (
              collections.map((col) => (
                <CollectionRow 
                  key={col.collectionId} 
                  collection={col} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CollectionTable;

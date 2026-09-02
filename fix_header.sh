sed -i '/<span>高原物资<\/span>/,/<\\/button>/!b;//!d;/<\\/button>/{
r /dev/stdin
d}' src/components/Header.tsx << 'INNER_EOF'
          <span>高原物资</span>
        </button>
        <button
          id="tab-photos"
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'photos'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>公共图库</span>
        </button>
INNER_EOF

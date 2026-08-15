import React, { useState, useEffect } from 'react';

interface LearnModule {
  title: string;
  url: string;
  duration_in_minutes: number;
  icon_url?: string;
  summary?: string;
}

interface AzureUpdate {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

/**
 * Shows Microsoft Learn study paths + Azure Updates for AI-300 users.
 * Uses Microsoft Learn Catalog API and Azure Updates RSS (via proxy).
 */
const AzureResources: React.FC = () => {
  const [learnModules, setLearnModules] = useState<LearnModule[]>([]);
  const [azureUpdates, setAzureUpdates] = useState<AzureUpdate[]>([]);
  const [activeTab, setActiveTab] = useState<'learn' | 'updates'>('learn');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLearnModules();
    fetchAzureUpdates();
  }, []);

  const fetchLearnModules = async () => {
    try {
      const resp = await fetch(
        'https://learn.microsoft.com/api/catalog/?type=modules&products=azure-machine-learning&locale=en-us'
      );
      if (!resp.ok) throw new Error('Failed to fetch');
      const data = await resp.json();
      const modules = (data.modules || [])
        .slice(0, 10)
        .map((m: any) => ({
          title: m.title,
          url: m.url,
          duration_in_minutes: m.duration_in_minutes || 0,
          icon_url: m.icon_url,
          summary: m.summary,
        }));
      setLearnModules(modules);
    } catch (err) {
      // Fallback static data
      setLearnModules([
        { title: 'Introduction to Azure Machine Learning', url: 'https://learn.microsoft.com/training/modules/intro-to-azure-ml/', duration_in_minutes: 30, summary: 'Learn the basics of Azure ML workspace, compute, and experiments.' },
        { title: 'Train models with Azure Machine Learning CLI v2', url: 'https://learn.microsoft.com/training/modules/train-models-with-azure-machine-learning-cli-v2/', duration_in_minutes: 45, summary: 'Use CLI v2 to submit training jobs and manage experiments.' },
        { title: 'Deploy models with Azure Machine Learning', url: 'https://learn.microsoft.com/training/modules/register-and-deploy-model-with-amls/', duration_in_minutes: 40, summary: 'Deploy models as real-time and batch endpoints.' },
        { title: 'Monitor models with Azure Machine Learning', url: 'https://learn.microsoft.com/training/modules/monitor-models-with-azure-machine-learning/', duration_in_minutes: 35, summary: 'Detect data drift and monitor model performance.' },
        { title: 'Use MLflow with Azure Machine Learning', url: 'https://learn.microsoft.com/training/modules/use-mlflow-azure-machine-learning/', duration_in_minutes: 40, summary: 'Track experiments and register models with MLflow.' },
        { title: 'Orchestrate ML pipelines with Azure ML', url: 'https://learn.microsoft.com/training/modules/create-pipelines-in-aml/', duration_in_minutes: 50, summary: 'Build reusable training and deployment pipelines.' },
        { title: 'Fine-tune foundation models in Azure AI Foundry', url: 'https://learn.microsoft.com/training/modules/fine-tune-foundation-model/', duration_in_minutes: 45, summary: 'Fine-tune LLMs for domain-specific use cases.' },
        { title: 'Implement RAG with Azure AI Search', url: 'https://learn.microsoft.com/training/modules/implement-rag/', duration_in_minutes: 50, summary: 'Build retrieval-augmented generation patterns.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAzureUpdates = async () => {
    try {
      // Use a CORS proxy to fetch Azure Updates RSS
      const resp = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https://azurecomcdn.azureedge.net/en-us/updates/feed/'
      );
      if (!resp.ok) throw new Error('Failed');
      const data = await resp.json();
      const items = (data.items || [])
        .filter((item: any) =>
          item.title.toLowerCase().includes('machine learning') ||
          item.title.toLowerCase().includes('ai') ||
          item.title.toLowerCase().includes('openai') ||
          item.title.toLowerCase().includes('foundry') ||
          item.title.toLowerCase().includes('cognitive')
        )
        .slice(0, 8)
        .map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          description: (item.description || '').replace(/<[^>]*>/g, '').slice(0, 120),
        }));
      setAzureUpdates(items);

      // If no AI-specific updates, show latest general ones
      if (items.length === 0) {
        setAzureUpdates(
          (data.items || []).slice(0, 6).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: (item.description || '').replace(/<[^>]*>/g, '').slice(0, 120),
          }))
        );
      }
    } catch {
      setAzureUpdates([]);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'learn'
              ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📚 Study Path
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'updates'
              ? 'text-indigo-700 border-b-2 border-indigo-600 bg-indigo-50/50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔔 Azure Updates
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'learn' && (
          <div>
            <p className="text-xs text-gray-500 mb-3">Official Microsoft Learn modules for AI-300 preparation</p>
            {isLoading ? (
              <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
            ) : (
              <div className="space-y-2.5">
                {learnModules.map((mod, idx) => (
                  <a
                    key={idx}
                    href={mod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-700">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition line-clamp-1">
                        {mod.title}
                      </p>
                      {mod.summary && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{mod.summary}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{mod.duration_in_minutes}m</span>
                  </a>
                ))}
              </div>
            )}
            <a
              href="https://learn.microsoft.com/credentials/certifications/resources/study-guides/ai-300"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View full AI-300 study guide on Microsoft Learn →
            </a>
          </div>
        )}

        {activeTab === 'updates' && (
          <div>
            <p className="text-xs text-gray-500 mb-3">Latest Azure AI & ML service announcements — exam may test new features</p>
            {azureUpdates.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Loading updates...</p>
            ) : (
              <div className="space-y-3">
                {azureUpdates.map((update, idx) => (
                  <a
                    key={idx}
                    href={update.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition line-clamp-1 flex-1">
                        {update.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{formatDate(update.pubDate)}</span>
                      {update.description && (
                        <span className="text-xs text-gray-500 line-clamp-1">— {update.description}</span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
            <a
              href="https://azure.microsoft.com/updates/"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-center text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View all Azure updates →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AzureResources;

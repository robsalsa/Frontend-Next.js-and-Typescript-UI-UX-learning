import { ModernTableWithPagination } from '@/components/ModernTableWithPagination';

// Sample data for demonstration
const sampleData = [
  { id: '001', name: 'Acme Corporation', category: 'Technology' },
  { id: '002', name: 'Bright Solutions Inc', category: 'Finance' },
  { id: '003', name: 'Creative Minds LLC', category: 'Marketing' },
  { id: '004', name: 'Dynamic Systems', category: 'Healthcare' },
  { id: '005', name: 'Elite Innovations', category: 'Technology' },
  { id: '006', name: 'Future Tech Group', category: 'Technology' },
  { id: '007', name: 'Global Finance Corp', category: 'Finance' },
  { id: '008', name: 'Healthcare Plus', category: 'Healthcare' },
  { id: '009', name: 'Innovation Labs', category: 'Research' },
  { id: '010', name: 'Jupiter Industries', category: 'Manufacturing' },
  { id: '011', name: 'Keystone Partners', category: 'Consulting' },
  { id: '012', name: 'Lighthouse Media', category: 'Marketing' },
  { id: '013', name: 'Momentum Capital', category: 'Finance' },
  { id: '014', name: 'NextGen Solutions', category: 'Technology' },
  { id: '015', name: 'Optimal Health', category: 'Healthcare' },
  { id: '016', name: 'Pioneer Analytics', category: 'Data Science' },
  { id: '017', name: 'Quantum Computing', category: 'Technology' },
  { id: '018', name: 'Retail Giants Co', category: 'Retail' },
  { id: '019', name: 'Strategic Advisors', category: 'Consulting' },
  { id: '020', name: 'TechVision Systems', category: 'Technology' },
  { id: '021', name: 'Unity Pharmaceuticals', category: 'Healthcare' },
  { id: '022', name: 'Vertex Capital', category: 'Finance' },
  { id: '023', name: 'Wellness Group', category: 'Healthcare' },
  { id: '024', name: 'Xcelerate Marketing', category: 'Marketing' },
  { id: '025', name: 'Yield Investments', category: 'Finance' },
  { id: '026', name: 'Zenith Technologies', category: 'Technology' },
  { id: '027', name: 'Alpha Logistics', category: 'Transportation' },
  { id: '028', name: 'Beta Manufacturing', category: 'Manufacturing' },
  { id: '029', name: 'Gamma Research', category: 'Research' },
  { id: '030', name: 'Delta Services', category: 'Consulting' },
  { id: '031', name: 'Epsilon Energy', category: 'Energy' },
  { id: '032', name: 'Zeta Aerospace', category: 'Aerospace' },
  { id: '033', name: 'Eta Education', category: 'Education' },
  { id: '034', name: 'Theta Security', category: 'Security' },
  { id: '035', name: 'Iota Insurance', category: 'Insurance' },
  { id: '036', name: 'Kappa Real Estate', category: 'Real Estate' },
  { id: '037', name: 'Lambda Legal', category: 'Legal' },
  { id: '038', name: 'Mu Media Productions', category: 'Entertainment' },
  { id: '039', name: 'Nu Nutrition', category: 'Healthcare' },
  { id: '040', name: 'Xi Telecommunications', category: 'Technology' },
  { id: '041', name: 'Omicron Optics', category: 'Manufacturing' },
  { id: '042', name: 'Pi Pharmaceuticals', category: 'Healthcare' },
  { id: '043', name: 'Rho Robotics', category: 'Technology' },
  { id: '044', name: 'Sigma Software', category: 'Technology' },
  { id: '045', name: 'Tau Transportation', category: 'Transportation' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-8 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Pagination & Modern Filtering Demo
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            This is an example of what Pagination does.
          </p>
          <ul className="mt-2 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>
                Dynamic Item Count per Page
            </li>
            <li>
                Modern Filter UI/UX
            </li>
            <li>
                Slightly Better Filtering (also Dynamic)
            </li>
          </ul>

          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Note: This is not a good sample code but the functions within "app\component\ModernTableWithPagination" is the meat of the content
          </p>


        </header>

        {/* Table Component */}
        <ModernTableWithPagination data={sampleData} />
        
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Note the dataset is not important they are simply placeholders to test the Item Count and Pagination
          </p>

      </div>
    </main>
  );
}

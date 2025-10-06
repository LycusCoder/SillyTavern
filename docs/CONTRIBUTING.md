# Contributing to ChimeraAI

Terima kasih atas minat Anda untuk berkontribusi pada ChimeraAI! Dokumen ini memberikan panduan untuk berkontribusi pada project ini.

## 🚀 Quick Start untuk Contributors

### Prerequisites
- Node.js 18+ (recommended: 20+)
- Yarn package manager
- Git
- VS Code (recommended) dengan extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier

### Setup Development Environment
```bash
# Clone repository
cd /app/ChimeraDev

# Install dependencies
yarn install

# Start development server
yarn dev

# Start SillyTavern backend (required)
cd /app && node server.js --port 8000
```

### Access Points
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:8000
- **Docs**: /docs directory

## 📁 Project Structure

```
ChimeraDev/
├── src/                    # Source code
│   ├── components/        # React components
│   │   ├── Layout/       # Layout components
│   │   └── Chat/         # Chat-related components
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   ├── api/              # API layer & HTTP client
│   ├── utils/            # Utility functions
│   └── hooks/            # Custom React hooks
├── docs/                  # Documentation
│   ├── phase1/           # Phase 1 documentation
│   ├── phase2/           # Phase 2 planning
│   └── assets/           # Screenshots & diagrams
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## 🎯 Development Guidelines

### Code Style
- **TypeScript**: Mandatory untuk all new code
- **ESLint**: Follow existing linting rules
- **Prettier**: Auto-formatting enabled
- **Naming**: 
  - Components: PascalCase (`MessageItem.tsx`)
  - Files: kebab-case untuk non-components
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE

### Component Guidelines
```typescript
// Good component structure
interface Props {
  message: IChatMessage;
  character: ICharacter;
  onEdit?: (messageId: string) => void;
}

const MessageItem: React.FC<Props> = ({ message, character, onEdit }) => {
  // Component logic here
  
  return (
    <div className="message-item">
      {/* JSX content */}
    </div>
  );
};

export default MessageItem;
```

### State Management
- Use Zustand untuk global state
- Keep component state local when possible
- Follow the existing store patterns
- Document any new store actions

### Styling Guidelines
- **Tailwind CSS**: Primary styling method
- **Custom CSS**: Only when Tailwind insufficient
- **Responsive**: Mobile-first approach
- **Theme Support**: Support both light & dark modes
- **Consistency**: Follow established color palette

```css
/* Example: Good Tailwind usage */
className="p-4 rounded-lg bg-chimera-light-surface dark:bg-chimera-dark-surface 
          border border-chimera-light-accent dark:border-chimera-dark-accent
          hover:bg-chimera-light-accent dark:hover:bg-chimera-dark-accent
          transition-colors duration-200"
```

## 🔄 Development Workflow

### Branch Strategy
- **main**: Production-ready code (Phase 1 complete)
- **phase-2**: Phase 2 development branch
- **feature/**: New features (branch dari phase-2)
- **bugfix/**: Bug fixes
- **docs/**: Documentation updates

### Commit Convention
```bash
# Format: type(scope): description

feat(chat): add real-time streaming support
fix(ui): resolve dark mode toggle issue  
docs(api): update integration documentation
style(components): improve message bubble styling
refactor(store): optimize state management performance
test(api): add integration test coverage
```

### Pull Request Process
1. Fork atau create feature branch
2. Make changes dengan proper testing
3. Update documentation jika diperlukan
4. Ensure all tests pass
5. Submit PR dengan clear description
6. Address review feedback
7. Merge after approval

### Testing Requirements
```bash
# Run tests before submitting PR
yarn test           # Unit tests
yarn test:e2e      # End-to-end tests
yarn lint          # Linting
yarn type-check    # TypeScript validation
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Describe the bug**
Clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Additional context**
Any other context about the problem.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of what the problem is.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features considered.

**Additional context**
Screenshots, mockups, atau context tambahan.

**Priority Level**
- [ ] Critical (Breaking functionality)
- [ ] High (Important feature)
- [ ] Medium (Nice to have)
- [ ] Low (Future consideration)
```

## 🎨 UI/UX Contributions

### Design Guidelines
- Follow the established design system
- Maintain consistency dengan existing components
- Support both light & dark themes
- Ensure accessibility (WCAG 2.1 AA)
- Test pada various screen sizes

### Component Creation
1. Create component dalam appropriate directory
2. Add TypeScript interfaces untuk props
3. Implement responsive design
4. Add proper accessibility attributes
5. Include error states & loading states
6. Test dengan theme variations

### Icon Usage
```typescript
// Use Lucide React icons consistently
import { MessageSquare, Settings, User } from 'lucide-react';

// Standard icon sizing
<MessageSquare className="w-5 h-5" />  // Default
<Settings className="w-4 h-4" />       // Small
<User className="w-6 h-6" />           // Large
```

## 🔧 API Development

### API Layer Guidelines
- Use the existing API client (`src/api/client.ts`)
- Follow the established error handling patterns
- Add proper TypeScript types
- Include loading states
- Implement retry logic untuk critical calls

### Adding New API Functions
```typescript
// Example: New API function
export async function getCharacterDetails(characterId: string) {
  return apiCall<ICharacterDetails>('GET', `/characters/${characterId}`);
}

// Usage dalam component
const { data, error, loading } = useAPI(() => getCharacterDetails(characterId));
```

## 📚 Documentation Contributions

### Documentation Standards
- Write clear, concise explanations
- Include code examples where helpful
- Update relevant documentation when making changes
- Use consistent formatting & style

### Documentation Structure
- **README.md**: Project overview & quick start
- **phase1/**: Complete Phase 1 documentation
- **phase2/**: Phase 2 planning & specifications
- **CHANGELOG.md**: Version history & changes
- **API docs**: Keep API documentation current

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// Example: Component test
describe('MessageItem', () => {
  it('should display user message correctly', () => {
    const mockMessage: IChatMessage = {
      id: 'test-1',
      sender: 'user',
      name: 'Test User',
      text: 'Hello world',
      timestamp: Date.now(),
      is_regenerated: false
    };
    
    render(<MessageItem message={mockMessage} character={mockCharacter} />);
    
    expect(screen.getByText('Hello world')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
```

### Integration Testing
- Test API integration points
- Verify state management flows
- Test error handling scenarios
- Validate responsive behavior

## 🚀 Phase 2 Development

### Priority Areas untuk Contributions
1. **API Integration**: Real backend connectivity
2. **Extensions System**: Quick Reply, World Info, Token Counter
3. **Character Management**: Creation wizard & import/export
4. **Voice Integration**: STT/TTS implementation
5. **Performance**: Optimization & caching
6. **Mobile**: Enhanced mobile experience

### Getting Started with Phase 2
1. Read [Phase 2 Roadmap](./phase2/roadmap.md)
2. Check [Integration Plan](./phase2/integration-plan.md)  
3. Review [Feature Specifications](./phase2/features.md)
4. Pick a feature atau bug to work on
5. Create feature branch dari `phase-2`
6. Start development!

## 📞 Getting Help

### Communication Channels
- **Issues**: GitHub issues untuk bug reports & feature requests
- **Discussions**: GitHub discussions untuk general questions
- **Documentation**: Comprehensive docs dalam /docs directory

### Code Review Process
- All PRs require review before merging
- Focus pada code quality, performance, dan maintainability
- Provide constructive feedback
- Test changes thoroughly

### Development Support
- Check existing documentation first
- Search existing issues before creating new ones
- Provide detailed context dalam questions
- Include code examples when relevant

## 🏆 Recognition

### Contributors
All contributors will be recognized dalam:
- CHANGELOG.md contributor list
- GitHub contributor graph
- Project documentation

### Code of Conduct
- Be respectful dan inclusive
- Focus pada constructive feedback
- Help others learn & grow
- Maintain professional communication

---

**Happy Contributing!** 🎉

Your contributions help make ChimeraAI better for everyone. Whether it's code, documentation, design, atau testing - every contribution is valuable!
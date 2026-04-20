# How to Change the Version Number

## If You Want a Different Version

Currently set to: **0.2.0**

### Option 1: Change to 1.0.0 (Production Ready)

```bash
cd /workspace

# Update package.json
sed -i 's/"version": "0.2.0"/"version": "1.0.0"/g' package.json

# Verify
cat package.json | grep version
```

### Option 2: Change to 0.1.0 (First Release)

```bash
cd /workspace

# Update package.json
sed -i 's/"version": "0.2.0"/"version": "0.1.0"/g' package.json

# Verify
cat package.json | grep version
```

### Option 3: Any Custom Version

```bash
cd /workspace

# Update package.json (replace X.Y.Z with your version)
sed -i 's/"version": "0.2.0"/"version": "X.Y.Z"/g' package.json

# Verify
cat package.json | grep version
```

## After Changing

Don't forget to:
1. Commit the change
2. Use the new version in your GitHub release (vX.Y.Z)
3. Use the new version when publishing to npm

## Quick Version Decision Guide

### Choose 1.0.0 if:
- ✅ You want it to look production-ready
- ✅ You're confident in the stability
- ✅ You want to attract serious users
- ✅ The SDK is feature-complete for your goals

### Choose 0.2.0 if:
- ✅ Current version is 0.1.0
- ✅ You want room for more changes
- ✅ You're still experimenting
- ✅ You want to signal "still improving"

### Choose 0.1.0 if:
- ✅ This is the very first release
- ✅ No previous versions exist
- ✅ You want to start fresh

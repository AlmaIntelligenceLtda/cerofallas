const fs = require('fs');
const path = require('path');

const target = path.join(
  process.cwd(),
  'node_modules',
  '@react-native-community',
  'clipboard',
  'android',
  'src',
  'main',
  'java',
  'com',
  'reactnativecommunity',
  'clipboard',
  'ClipboardModule.java'
);

if (!fs.existsSync(target)) {
  console.log('ClipboardModule.java not found, skipping patch.');
  process.exit(0);
}

let src = fs.readFileSync(target, 'utf8');

src = src.replace(
  'import com.facebook.react.bridge.ContextBaseJavaModule;',
  'import com.facebook.react.bridge.ReactApplicationContext;\nimport com.facebook.react.bridge.ReactContextBaseJavaModule;'
);

src = src.replace(
  'public class ClipboardModule extends ContextBaseJavaModule {',
  'public class ClipboardModule extends ReactContextBaseJavaModule {'
);

src = src.replace(
  'public ClipboardModule(Context context) {\n    super(context);\n  }',
  'public ClipboardModule(ReactApplicationContext reactContext) {\n    super(reactContext);\n  }'
);

src = src.replace(
  /private ClipboardManager getClipboardService\([\s\S]*?\n\s*\}/,
  `private ClipboardManager getClipboardService() {\n    Context ctx = getReactApplicationContext();\n    return (ClipboardManager) ctx.getSystemService(Context.CLIPBOARD_SERVICE);\n  }`
);

fs.writeFileSync(target, src, 'utf8');
console.log('Patched ClipboardModule.java');

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">設定</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="account">アカウント</TabsTrigger>
          <TabsTrigger value="appearance">表示</TabsTrigger>
          <TabsTrigger value="notifications">通知</TabsTrigger>
        </TabsList>

        {/* Account Settings Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>アカウント設定</CardTitle>
              <CardDescription>
                アカウント情報を更新します。変更後は保存してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">名前</Label>
                <Input id="name" defaultValue="管理者ユーザー" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" disabled />
                 <p className="text-sm text-muted-foreground">
                    メールアドレスの変更は現在サポートされていません。
                 </p>
              </div>
               <div className="space-y-1">
                <Label htmlFor="current_password">現在のパスワード</Label>
                <Input id="current_password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new_password">新しいパスワード</Label>
                <Input id="new_password" type="password" placeholder="••••••••" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>変更を保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appearance Settings Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>表示設定</CardTitle>
              <CardDescription>
                管理画面の表示をカスタマイズします。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                 <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>ダークモード</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      目に優しいダークテーマに切り替えます。
                    </span>
                 </Label>
                 <Switch id="dark-mode" aria-label="ダークモード切り替え" />
               </div>
               {/* Add more appearance settings here if needed */}
            </CardContent>
             <CardFooter>
              <Button>変更を保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知設定</CardTitle>
              <CardDescription>
                受け取るメール通知の種類を設定します。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                 <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
                    <span>マーケティングメール</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      新機能やプロモーションに関するメールを受け取ります。
                    </span>
                 </Label>
                 <Switch id="marketing-emails" defaultChecked />
               </div>
               <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                 <Label htmlFor="order-updates" className="flex flex-col space-y-1">
                    <span>注文更新通知</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      新規注文やステータス変更に関するメールを受け取ります。
                    </span>
                 </Label>
                 <Switch id="order-updates" defaultChecked />
               </div>
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                 <Label htmlFor="security-alerts" className="flex flex-col space-y-1">
                    <span>セキュリティアラート</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      アカウントのセキュリティに関する重要な通知を受け取ります。
                    </span>
                 </Label>
                 <Switch id="security-alerts" disabled checked />
               </div>
            </CardContent>
             <CardFooter>
              <Button>変更を保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

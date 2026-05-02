import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import os

class HexoGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Hexo 博客管理")
        self.root.geometry("400x300")
        
        self.project_path = r"e:\项目管理\Blog\Hexo-blog\blog"
        
        self.create_widgets()
    
    def create_widgets(self):
        frame = ttk.Frame(self.root, padding="30")
        frame.pack(fill=tk.BOTH, expand=True)
        
        title_label = ttk.Label(frame, text="Hexo 博客管理", font=('Arial', 16, 'bold'))
        title_label.pack(pady=(0, 30))
        
        style = ttk.Style()
        style.configure('Hexo.TButton', font=('Arial', 12), padding=15)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill=tk.X, pady=10)
        self.btn_deploy = ttk.Button(btn_frame, text="生成并部署", style='Hexo.TButton',
                                     command=self.run_deploy)
        self.btn_deploy.pack(fill=tk.X)
        
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill=tk.X, pady=10)
        self.btn_server = ttk.Button(btn_frame, text="启动本地服务器", style='Hexo.TButton',
                                     command=self.run_server)
        self.btn_server.pack(fill=tk.X)
        
        self.output_text = tk.Text(frame, height=8, wrap=tk.WORD, state=tk.DISABLED)
        self.output_text.pack(fill=tk.BOTH, expand=True, pady=(20, 0))
    
    def log(self, message):
        self.output_text.config(state=tk.NORMAL)
        self.output_text.insert(tk.END, message + "\n")
        self.output_text.see(tk.END)
        self.output_text.config(state=tk.DISABLED)
        self.root.update_idletasks()
    
    def run_deploy(self):
        self.log("进入项目文件夹...")
        try:
            os.chdir(self.project_path)
            self.log(f"已进入: {self.project_path}")
            
            self.log("\n执行 hexo g...")
            result = subprocess.run(["npx", "hexo", "g"], capture_output=True, text=True, encoding='utf-8')
            self.log(result.stdout)
            if result.stderr:
                self.log(f"错误: {result.stderr}")
                messagebox.showerror("错误", "hexo g 执行失败")
                return
            
            self.log("\n执行 hexo d...")
            result = subprocess.run(["npx", "hexo", "d"], capture_output=True, text=True, encoding='utf-8')
            self.log(result.stdout)
            if result.stderr:
                self.log(f"错误: {result.stderr}")
                messagebox.showerror("错误", "hexo d 执行失败")
                return
            
            messagebox.showinfo("完成", "部署成功！")
        except Exception as e:
            self.log(f"错误: {str(e)}")
            messagebox.showerror("错误", f"执行失败:\n{str(e)}")
    
    def run_server(self):
        self.log("进入项目文件夹...")
        try:
            os.chdir(self.project_path)
            self.log(f"已进入: {self.project_path}")
            
            self.log("\n启动服务器 hexo s...")
            self.server_process = subprocess.Popen(["npx", "hexo", "s"], 
                                                  stdout=subprocess.PIPE, 
                                                  stderr=subprocess.PIPE,
                                                  text=True,
                                                  encoding='utf-8')
            self.log("服务器已启动")
            messagebox.showinfo("服务器已启动", "访问地址: http://localhost:4000")
        except Exception as e:
            self.log(f"错误: {str(e)}")
            messagebox.showerror("错误", f"启动失败:\n{str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = HexoGUI(root)
    root.mainloop()